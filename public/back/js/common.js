


//功能1 : 在第一个ajax请求发送时开启进度条  然后在最后一个ajax请求请求完成后结束进度条
//使用ajax全局事件  ajaxStart   第一个ajax请求发送时触发

$(document).ajaxStart( function () {
  //开启进度条
  NProgress.start();
})


//在所有ajax请求发送完成后触发事件
$(document).ajaxStop( function () {

  //因为是本地服务器  所以请求会响应的很快  看不出效果  所以我们模拟网络延时
  setTimeout( function () {
    //关闭进度条
    NProgress.done();
  }, 1000)
})



//功能2 : 登录拦截功能
//判断一下地址栏中的地址是否有login.html 如果是  就不进行拦截  让用户进行登录即可  
//        如果不是  发送ajax 请求  到后台  判断用户是否已经登录  如果没有登录  拦截到登录页面

if ( location.href.indexOf('login.html') === -1 ) {
  //说明不是在登录页面  发送ajax请求根据后台返回的数据判断用户是否登录  没有登录拦截到登录页面
  $.ajax({
    type : 'get',
    url : "/employee/checkRootLogin",
    dataType : 'json',
    success : function ( info ) {
      if ( info.error === 400 ) {
        location.href = "login.html";
      } 
    } 
  })
}



//分类管理的切换功能
$( function () {

  //选中分类管理功能  给此元素注册点击事件   在事件处理函数中  让 child  执行动画  淡入淡出功能
  $('.nav .category').click( function () {
    console.log('点击事件注册成功');
    $('.nav .child').stop().slideToggle();
  })


  //左侧侧边栏切换功能
  $('.icon_menu').click( function () {
    $('.lt_aside').toggleClass('hidemenu');
    $('.lt_topbar').toggleClass('hidemenu');
    $('.lt_main').toggleClass('hidemenu');
  })



  //功能3 : 点击topbar退出登录
  $('.icon_logout').click( function () {
    //让模态框显示
    $('#logoutModal').modal('show');
  })


  //功能4 : 点击模态框的退出按钮  退出登录
  $('#logoutBtn').click( function () {
    //发送ajax请求退出登录
    $.ajax({
      type : 'get',
      url : '/employee/employeeLogout',
      dataType : 'json',
      success : function ( info ) {
        if ( info.success ) {
          //退出成功  跳转到登录页
          location.href = 'login.html';
        }
      }
    })
  })
})