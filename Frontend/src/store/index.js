import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      items: [],
      cookieValue: null
    }
  },
  mutations: {
    changeItems(state, items) {
      state.items = items
    },
    SET_USER_COOKIE(state, cookieValue) {
      state.cookieValue = cookieValue;
    },
  },
  getters: {
    items: state => state.items,
    cookieValue: state => state.cookieValue
  },
  actions: {
    logout(context) {
      context.commit("SET_USER_COOKIE", null);
      deleteBrowserCookie('session_hash');
    },
    setCookie(context, hashValue) {
      if (hashValue == "0" || !hashValue) {
        context.commit("SET_USER_COOKIE", null);
        deleteBrowserCookie('session_hash');
      } else {
        context.commit("SET_USER_COOKIE", hashValue);
        setBrowserCookie('session_hash', hashValue, 365 * 5);
      }
    },
    tryGetBrowserCookie(context) {
      return new Promise((resolve, reject) => {
        try {
          if (context.state.cookieValue) {
            resolve(context.state.cookieValue);
          } else {
            let cookie = getBrowserCookie("session_hash");
            if (cookie) {
              context.commit("SET_USER_COOKIE", cookie);
              resolve(cookie);
            } else {
              resolve(null);
            }
          }
        } catch (error) {
          reject(error);
        }
      })

    }
  },
  modules: {
  }
})

//Custom functions
//Vue 3 does not yet support vue-cookies or similar dependencies

function getBrowserCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let c = cookieArray[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setBrowserCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteBrowserCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}