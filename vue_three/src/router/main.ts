import router from "@/router";
import { pageStore } from "@/store/user";

router.beforeEach((to,form,next)=>{
    // console.log('路由导航',to,form);
    next()
})
router.afterEach((to,form)=>{
    // console.log(router);
    
    pageStore().changePage(to.fullPath)
})