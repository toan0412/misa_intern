const AsyncPopup = defineAsyncComponent({
  loader: () => import('./LoginPopup.vue'),
  loadingComponent: LoadingComponent /* shows while loading */,
  errorComponent: ErrorComponent /* shows if there's an error */,
  delay: 1000 /* delay in ms before showing loading component */,
  timeout: 3000 /* timeout after this many ms */,
})