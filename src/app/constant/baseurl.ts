import { environment } from '../../environments/environment';
export let baseApi :string;
if (environment.qa) {
    // QA URL
    baseApi = "http://10.20.1.13:8091/api/";

}
else if (environment.dev) {
    // DEV URL
    baseApi = "http://10.20.1.13:9091/api/";
}
else if (environment.uat) {
    // UAT URL
    baseApi = "http://10.20.1.13:7091/api/";

}
else if (environment.prod) {
    // PROD URL
    baseApi = "https://betaapi.hashmove.com/api/";
}
else {
    // PERSONAL URL
    baseApi = "192.168.200.51:3020/";
}