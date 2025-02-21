import { describe, it, expect, vi } from "vitest";
import { createPinia, setActivePinia } from 'pinia';
import { serviceContainer } from "src/modules/Images/infrastructure/services/ServiceContainer.js";
import { useErrorNotification } from "src/modules/Shared/ui/composables/errorNotificaction.js";
import { app } from 'vue';

beforeEach(() => {
  const pinia = createPinia();
  setActivePinia(pinia);
  app.use(pinia);
});

// Simulamos la función handleSearchImages
const handleSearchImages = async (query, page, perPage) => {
  try {
    await serviceContainer.searchService.searchImages(query, page, perPage);
  } catch (error) {
    errorNotification.notifyError(error);
  }
};

describe("handleSearchImages", () => {
  it("debe llamar a searchImages con los parámetros correctos", async () => {
    // Mockeamos el servicio para evitar llamadas reales
    serviceContainer.searchService.searchImages = vi.fn().mockResolvedValue([
      { id: 1, url: "https://example.com/image1.jpg" },
    ]);

    // Ejecutamos la función
    await handleSearchImages("cats", 1, 10);

    // Verificamos que se haya llamado con los argumentos correctos
    expect(serviceContainer.searchService.searchImages).toHaveBeenCalledWith("cats", 1, 10);
  });

  it("debe manejar errores correctamente", async () => {
    // Mockeamos el servicio para que falle
    serviceContainer.searchService.searchImages = vi.fn().mockRejectedValue(new Error("Error en la API"));

    // Mockeamos la función de notificación de errores
    useErrorNotification().notifyError = vi.fn();

    // Ejecutamos la función
    await handleSearchImages("dogs", 1, 10);

    // Verificamos que se notificó el error
    expect(useErrorNotification().notifyError).toHaveBeenCalledWith(new Error("Error en la API"));
  });
});
