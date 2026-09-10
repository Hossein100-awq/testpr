const DEMO_ACCESS_KEY = 'avax-gods-demo-access';

export const hasDemoAccess = () => sessionStorage.getItem(DEMO_ACCESS_KEY) === 'granted';

export const grantDemoAccess = () => {
  sessionStorage.setItem(DEMO_ACCESS_KEY, 'granted');
};
