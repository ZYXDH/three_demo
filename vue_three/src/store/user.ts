import { defineStore } from "pinia";

export const userStore = defineStore({
    id: 'userInfo',
    state: () => {
        return{
            username: '321'
        }
    },
    getters:{

    },
    actions:{

    }
})
export const pageStore = defineStore({
    id: 'pageInfo',
    state: () => {
        return{
            pagename:'home'
        }
    },
    getters:{

    },
    actions:{
        changePage(pagename: string){
            this.pagename=pagename
        }
    }
})