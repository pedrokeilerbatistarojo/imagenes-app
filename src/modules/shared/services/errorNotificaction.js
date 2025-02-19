import { useQuasar } from 'quasar';

export function useErrorNotification() {
  const $q = useQuasar();

  const notifyError = (message) => {
    $q.notify({
      position: 'top',
      type: 'negative',
      message: message,
    });
  };

  return {notifyError};
}
