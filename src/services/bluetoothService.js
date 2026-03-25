// src/services/bluetoothService.js

export class BluetoothService {
  constructor() {
    this.device = null;
    this.server = null;
    this.characteristic = null;
  }

  async isSupported() {
    // Verificar si el navegador soporta Web Bluetooth
    return 'bluetooth' in navigator;
  }

  async connect(deviceName = null) {
    try {
      if (!this.isSupported()) {
        throw new Error('Web Bluetooth no está soportado en este navegador. Usa Chrome, Edge o Android.');
      }

      // Solicitar dispositivo al usuario
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'NeuroSync' }], // Filtra por nombre
        optionalServices: [
          '0000neuro-0000-1000-8000-00805f9b34fb', // Tu servicio personalizado
          'battery_service' // Servicio estándar de batería
        ]
      });

      // Conectar al servidor GATT
      this.server = await this.device.gatt.connect();
      
      // Obtener servicio y característica
      const service = await this.server.getPrimaryService(
        '0000neuro-0000-1000-8000-00805f9b34fb'
      );
      this.characteristic = await service.getCharacteristic(
        '0000data-0000-1000-8000-00805f9b34fb'
      );

      // Configurar notificaciones (opcional)
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', (event) => {
        this.handleIncomingData(event.target.value);
      });

      return { 
        success: true, 
        deviceName: this.device.name,
        batteryLevel: await this.getBatteryLevel()
      };

    } catch (error) {
      console.error('Error en conexión Bluetooth:', error);
      return { success: false, error: error.message };
    }
  }

  async sendCommand(command, payload = {}) {
    if (!this.characteristic) {
      throw new Error('No hay característica conectada');
    }

    // Codificar comando (ajusta según tu protocolo)
    const data = new TextEncoder().encode(JSON.stringify({ command, payload }));
    await this.characteristic.writeValue(data);
    
    return { success: true };
  }

  async getBatteryLevel() {
    try {
      const batteryService = await this.server.getPrimaryService('battery_service');
      const batteryLevel = await batteryService.getCharacteristic('battery_level');
      const value = await batteryLevel.readValue();
      return value.getUint8(0);
    } catch {
      return null;
    }
  }

  handleIncomingData(dataView) {
    const decoder = new TextDecoder();
    const message = decoder.decode(dataView);
    console.log('Datos recibidos:', message);
    // Aquí puedes emitir eventos o actualizar estado
  }

  async disconnect() {
    if (this.device?.gatt?.connected) {
      await this.characteristic?.stopNotifications();
      this.device.gatt.disconnect();
    }
  }
}

export const bluetoothService = new BluetoothService();
