export async function checkBluetoothSupport() {
  const checks = {
    apiAvailable: 'bluetooth' in navigator,
    https: window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname.includes('github.dev'),
  }

  if (!checks.apiAvailable) {
    return {
      supported: false,
      message: 'Web Bluetooth no disponible. Usa Chrome/Edge en desktop o Android.'
    }
  }

  if (!checks.https) {
    return {
      supported: false,
      message: 'Web Bluetooth requiere HTTPS o localhost.'
    }
  }

  return { supported: true, message: '✅ Listo' }
}
