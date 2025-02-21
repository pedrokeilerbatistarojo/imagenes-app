import { UnsplashService } from './UnsplashService.js';

/**
 * Service container
 * Here we instantiate the image collection service that we are going to use
 * In this way we decouple the dependency on this service
 */

export const serviceContainer = {
  searchService: new UnsplashService(),
};
