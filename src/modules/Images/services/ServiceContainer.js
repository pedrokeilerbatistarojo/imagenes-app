import { UnsplashService } from './UnsplashService';

/**
 * Service container
 * Here we instantiate the image collection service that we are going to use
 * In this way we decouple the dependency on this service
 */

export const serviceContainer = {
  searchService: new UnsplashService(),
};
