import { environment } from '../../environments/environment';
export let baseApi :string;
export let meezanbaseApi :string;
export const socketURL :string = "http://192.168.200.9:3020";
if (environment.qa) {
    // QA URL
    baseApi = "http://192.168.200.46:3020";

}
else if (environment.dev) {
    // DEV URL
    baseApi = "http://192.168.200.46:3020";
}
else if (environment.uat) {
    // UAT URL
    baseApi = "http://192.168.200.46:3020";

}
else if (environment.prod) {
    // PROD URL
    baseApi = "https://betaapi.hashmove.com";
}
else {
    // PERSONAL URL
    baseApi = "http://192.168.200.9:3020";
    meezanbaseApi = "http://192.168.200.9:4000";
}