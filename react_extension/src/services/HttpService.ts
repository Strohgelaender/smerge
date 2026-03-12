import { toast } from "react-toastify";
import { getCurrentUser } from "./TeacherAuthService";

class HttpService {
  public csrftoken: string;
  public baseURL: string;

  constructor() {
    this.csrftoken = this.getCookie("csrftoken") ?? "";
    this.baseURL = window.location.origin;

    //     this.instance = axios.create({
    //     baseURL: 'http://127.0.0.1/api', // Replace with your API base URL
    //     timeout: 10000, // Set a timeout for requests (in milliseconds)
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     });

    //     this.token = ""; // Initialize the token to null
  }

  getCookie(key: string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

  postAsync<T>(
    endpoint: string,
    data: any,
    method: string = "POST",
    suppressNotificationSuccess = true,
    suppressNotificationFail = false,
    onRedirect = () => {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.post(
        endpoint,
        data,
        method,
        (xHttp) =>
          resolve(
            xHttp.responseText.includes("{")
              ? (JSON.parse(xHttp.responseText) as T)
              : (xHttp.responseText as T)
          ),
        reject,
        (reason: any) => {
          onRedirect();
          reject(reason);
        },
        suppressNotificationSuccess,
        suppressNotificationFail
      );
    });
  }

  post(
    endpoint: string,
    data: any,
    method: string = "POST",
    onSuccess: (_: XMLHttpRequest) => void,
    onFail: (_: XMLHttpRequest) => void,
    onRedirect: (_: XMLHttpRequest) => void,
    suppressNotificationSuccess = false,
    suppressNotificationFail = false
  ) {
    const xhttp = new XMLHttpRequest();
    xhttp.open(method, this.baseURL + endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    this.setCsrfHeader(xhttp);
    addAuthHeader(xhttp);
    xhttp.send(JSON.stringify(data));

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status <= 299) {
        onSuccess(xhttp);
        if (suppressNotificationSuccess) return;

        toast.success(`Get ${endpoint} worked (${xhttp.status}).`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
      } else if (xhttp.readyState === 4 && xhttp.status <= 399) {
        onRedirect(xhttp);
      } else if (xhttp.readyState === 4) {
        onFail(xhttp);
        if (suppressNotificationFail) return;

        toast.error(`Post ${endpoint} failed (${xhttp.status}).`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
    };
  }

  putAsync<T>(
    endpoint: string,
    data: any,
    method: string = "PUT",
    suppressNotificationSuccess = true,
    suppressNotificationFail = false,
    onRedirect = () => {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.put(
        endpoint,
        data,
        method,
        (xHttp) =>
          resolve(
            xHttp.responseText.includes("{")
              ? (JSON.parse(xHttp.responseText) as T)
              : (xHttp.responseText as T)
          ),
        reject,
        (reason: any) => {
          onRedirect();
          reject(reason);
        },
        suppressNotificationSuccess,
        suppressNotificationFail
      );
    });
  }

  put(
    endpoint: string,
    data: any,
    method: string = "PUT",
    onSuccess: (_: XMLHttpRequest) => void,
    onFail: (_: XMLHttpRequest) => void,
    onRedirect: (_: XMLHttpRequest) => void,
    suppressNotificationSuccess = false,
    suppressNotificationFail = false
  ) {
    const xhttp = new XMLHttpRequest();
    xhttp.open(method, this.baseURL + endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    this.setCsrfHeader(xhttp);
    addAuthHeader(xhttp);
    xhttp.send(JSON.stringify(data));

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status <= 299) {
        onSuccess(xhttp);
        if (suppressNotificationSuccess) return;

        toast.success(`Get ${endpoint} worked (${xhttp.status}).`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
      } else if (xhttp.readyState === 4 && xhttp.status <= 399) {
        onRedirect(xhttp);
      } else if (xhttp.readyState === 4) {
        onFail(xhttp);
        if (suppressNotificationFail) return;

        toast.error(`Get ${endpoint} failed (${xhttp.status}).`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
    };
  }

  getAsync<T>(endpoint: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.get(
        endpoint,
        (xHttp) => resolve(JSON.parse(xHttp.responseText) as T),
        reject,
        reject,
        true,
        false
      );
    });
  }

  getAsyncText<T>(endpoint: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.get(
        endpoint,
        (xHttp) => resolve(xHttp.responseText as T),
        reject,
        reject,
        true,
        false
      );
    });
  }

  get(
    endpoint: string,
    onSuccess: (_: XMLHttpRequest) => void,
    onFail: (_: XMLHttpRequest) => void,
    onRedirect: (_: XMLHttpRequest) => void,
    suppressNotificationSuccess = false,
    suppressNotificationFail = false
  ) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", this.baseURL + endpoint, true);
    this.setCsrfHeader(xhttp);
    addAuthHeader(xhttp);
    xhttp.send();

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status <= 299) {
        onSuccess(xhttp);
        if (suppressNotificationSuccess) return;

        toast.success(`Get ${endpoint} worked (${xhttp.status}).`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
      } else if (xhttp.readyState === 4 && xhttp.status <= 399) {
        onRedirect(xhttp);
      } else if (xhttp.readyState === 4) {
        onFail(xhttp);
        if (suppressNotificationFail) return;

        toast.error(`Get ${endpoint} failed (${xhttp.status}).`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
    };
  }

  // Holt einen neuen CSRF-Token vom Server, falls der aktuelle ungültig ist oder nicht existiert.
  ensureCsrfToken(): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest();
      xhttp.open("GET", this.baseURL + "/api/public/csrf", true);
      addAuthHeader(xhttp);
      xhttp.send();

      xhttp.onreadystatechange = () => {
        // 4 = DONE
        if (xhttp.readyState !== 4) {
          return;
        }
        if (xhttp.status >= 200 && xhttp.status <= 299) {
          this.refreshCsrfToken();
          resolve();
          return;
        }
        reject(new Error(`Failed to initialize CSRF token (${xhttp.status}).`));
      };
    });
  }

  private refreshCsrfToken() {
    this.csrftoken = this.getCookie("csrftoken") ?? "";
    return this.csrftoken;
  }

  private setCsrfHeader(xhttp: XMLHttpRequest) {
    const token = this.refreshCsrfToken();
    if (token) {
      xhttp.setRequestHeader("X-CSRFToken", token);
    }
  }

  postFormAsync<T>(
    endpoint: string,
    formData: FormData,
    method: string = "POST",
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest();
      xhttp.open(method, this.baseURL + endpoint, true);
      this.setCsrfHeader(xhttp);
      addAuthHeader(xhttp);

      xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status <= 299) {
          resolve(JSON.parse(xhttp.responseText) as T);
        } else if (xhttp.readyState === 4) {
          try {
            const payload = JSON.parse(xhttp.responseText);
            reject(new Error(payload.detail ?? `Request failed (${xhttp.status})`));
          } catch {
            reject(new Error(`Request failed (${xhttp.status})`));
          }
        }
      };

      xhttp.send(formData);
    });
  }
}

function addAuthHeader(xhttp: XMLHttpRequest) : void {
  if (getCurrentUser()) {
    xhttp.setRequestHeader('Authorization', 'Token ' + getCurrentUser().token);
  }
}

// Create an instance of the HttpService class
const httpService = new HttpService();
export default httpService;
