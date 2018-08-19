$( function () {

  //进行表单验证
  //用户名不能为空  长度为2-6位
  //密码不能为空  长度为6-12位


  $('#form').bootstrapValidator({

     //2. 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    //1. 配置字段
    fields : {
      //用户名
      username : {
        //设置校验规则
        validators : {
          //非空校验
          notEmpty : {
            //提示信息
            message : "用户名不能为空"
          },
          //长度校验
          stringLength : {
            min : 2,
            max : 6,
            message : "用户名长度必须在 2~6 位"
          },
          //专门用于配置回调函数的提示
          callback : {
            message : "用户名不存在"
          }
        }
      },
      //密码
      password : {
        //进行校验
        validators : {
          //非空校验
          notEmpty : {
            message : "密码不能为空"
          },
          //长度校验
          stringLength : {
            min : 6,
            max : 12,
            message : "密码必须要在 6-12 位"
          },
          //状态校验
          callback : {
            message : "密码错误"
          }
        }
      }
    }
  })


  //功能2 : 表单校验插件在提交表单时进行校验
            //校验成功 : 默认提交表单  会发生页面跳转  注册表单校验成功事件  阻止默认的提交 通过ajax提交
            //校验失败 : 不会提交表单  不会发生页面跳转 配置插件提示用户即可
  
  //注册表单校验成功事件
  $('#form').on( 'success.form.bv', function (e) {
    //阻止默认表单提交
    e.preventDefault();

    //发送ajax请求 
    $.ajax({
      type : 'post',
      url : '/employee/employeeLogin',
      data : $('#form').serialize(),
      dataType : 'json',
      success : function ( info ) {
        if ( info.success ) {
          //d登录成功,跳转到首页
          location.href = "index.html";
        }
        if ( info.error === 1000 ) {
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
        }
        if ( info.error === 1001 ) {
          $('#form').data('bootstrapValidator').updateStatus('password', "INVALID", 'callback');
        }
      }
    })
  })



  //功能3 : 进行重置   重置整个表单  resetForm
  $("[type='reset']").click( function () {
    $('#form').data('bootstrapValidator').resetForm();
  });
})