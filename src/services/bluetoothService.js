/**
 * Servicio de comunicación Bluetooth Low Energy (BLE)
 * Usa Web Bluetooth API (Chrome, Edge, Android)
 */

export const NEUROSYNC_SERVICE_UUID = '0000neuro-0000-1000-8000-00805f9b34fb';
export const NEUROSYNC_CHARACTERISTIC_UUID = '0000data-0000-1000-8000-00805f9b34fb';

export class BluetoothService {
  constructor() {
    this.device = null;
    this.server = null;
    this.characteristic = null;
    this.isConnected = false;
  }

  /**
   * Solicita conexión a dispositivo NeuroSync
   */
  async connect() {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth no soportado en este navegador');
      }

      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [NEUROSYNC_SERVICE_UUID] }],
        optionalServices: ['battery_service']
      });

      this.server = await this.device.gatt.connect();
      this.characteristic = await this.server.getPrimaryService(NEUROSYNC_SERVICE_UUID)
        .then(service => service.getCharacteristic(NEUROSYNC_CHARACTERISTIC_UUID));

      this.isConnected = true;
      
      // Configurar notificaciones para datos del dispositivo
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', 
        (event) => this.handleDeviceData(event));

      return { success: true, deviceName: this.device.name };
    } catch (error) {
      console.error('Error conectando Bluetooth:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envía configuración de sesión al hardware
   */
  async sendSessionConfig(config) {
    if (!this.isConnected || !this.characteristic) {
      throw new Error('No hay dispositivo conectado');
    }

    // Validar límites de seguridad antes de enviar
    const validatedConfig = this.validateSafetyLimits(config);

    // Protocolo de comando (ver hardwareProtocol.js)
    const command = this.encodeCommand('SESSION_START', validatedConfig);
    const encoder = new TextEncoder();
    
    await this.characteristic.writeValue(encoder.encode(command));
    return { success: true };
  }

  /**
   * Detiene toda estimulación inmediatamente
   */
  async emergencyStop() {
    if (!this.isConnected) return;

    const encoder = new TextEncoder();
    const command = this.encodeCommand('EMERGENCY_STOP', {});
    await this.characteristic.writeValue(encoder.encode(command));
  }

  /**
   * Valida configuración contra límites de seguridad
   */
  validateSafetyLimits(config) {
    const { SAFETY_LIMITS } = require('../constants/safety');

    // Validar corriente eléctrica
    if (config.electrodeCurrent_mA > SAFETY_LIMITS.tACS.maxCurrent_mA) {
      config.electrodeCurrent_mA = SAFETY_LIMITS.tACS.recommendedCurrent_mA;
      console.warn('Corriente reducida a límite seguro');
    }

    // Validar campo magnético
    if (config.magneticField_mT > SAFETY_LIMITS.magnetic.maxField_mT) {
      config.magneticField_mT = SAFETY_LIMITS.magnetic.recommendedField_mT;
      console.warn('Campo magnético reducido a límite seguro');
    }

    // Validar frecuencia
    if (config.frequency_Hz < SAFETY_LIMITS.magnetic.frequencyRange_Hz[0] ||
        config.frequency_Hz > SAFETY_LIMITS.magnetic.frequencyRange_Hz[1]) {
      config.frequency_Hz = 10; // Frecuencia por defecto segura
      console.warn('Frecuencia ajustada a rango seguro');
    }

    return config;
  }

  /**
   * Codifica comando en protocolo binario
   */
  encodeCommand(commandType, payload) {
    const protocol = require('./hardwareProtocol');
    return protocol.encode(commandType, payload);
  }

  /**
   * Maneja datos recibidos del dispositivo
   */
  handleDeviceData(event) {
    const value = event.target.value;
    const protocol = require('./hardwareProtocol');
    const decoded = protocol.decode(value);

    // Actualizar estado en UI
    if (window.hardwareStatusCallback) {
      window.hardwareStatusCallback(decoded);
    }

    // Verificar emergencias
    if (decoded.type === 'ALERT' || decoded.type === 'ERROR') {
      this.emergencyStop();
      if (window.emergencyCallback) {
        window.emergencyCallback(decoded);
      }
    }
  }

  /**
   * Desconecta dispositivo
   */
  async disconnect() {
    if (this.device && this.device.gatt.connected) {
      await this.emergencyStop();
      this.device.gatt.disconnect();
      this.isConnected = false;
    }
  }
}

export const bluetoothService = new BluetoothService();
