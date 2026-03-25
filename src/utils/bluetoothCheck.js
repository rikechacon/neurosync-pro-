// src/utils/bluetoothCheck.js

export async function checkBluetoothSupport() {
  const checks = {
    apiAvailable: 'bluetooth' in navigator,
    https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
    userAgent: navigator.userAgent
  };

  console.table(checks);

  if (!checks.apiAvailable) {
    return {
      supported: false,
      message: 'Web Bluetooth API no disponible. Usa Chrome/Edge en HTTPS o localhost.'
    };
  }

  if (!checks.https) {
    return {
      supported: false,
      message: 'Web Bluetooth requiere HTTPS (o localhost para desarrollo).'
    };
  }

  return {
    supported: true,
    message: '✅ Web Bluetooth listo para usar'
  };
}

// Uso en tu componente:
// const result = await checkBluetoothSupport();
// if (!result.supported) alert(result.message);
