$( function () {



  //功能1 : 登录拦截功能

  //判断用户当前页面是否是登录页  如果不是登录页  进行登录拦截
  if ( location.href.indexOf('login.html') === -1 ) {
    //发送ajax请求
    $.ajax({
      type : 'get',
      url : '/employee/checkRootLogin',
      dataType : 'json',
      success : function ( info ) {
        if ( info.error === 400) {
          location.href = 'login.html';
        }
      }
    })
  }

})