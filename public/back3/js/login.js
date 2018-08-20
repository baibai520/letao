$( function () {


  //进行表单验证
  $('#form').bootstrapValidator({
    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    //配置字段
    fields : {
      //用户名
      username : {
        //进行校验
        validators : {
          //非空校验
          notEmpty : {
            message : "用户名不能为空"
          },
          //长度校验
          stringLength : {
            min : 2,
            max : 6,
            message : '用户名长度必须在 2-6 位'
          },
          callback : {
            message : '用户名不存在'
          }
        }
      },
      //密码
      password : {
        validators : {
          notEmpty : {
            message : '密码不能为空'
          },
          stringLength : {
            min : 6,
            max : 12,
            message : '密码长度必须是 6-12 位'
          },
          callback : {
            message : '密码错误'
          }
        }
      }
    }
  })


  //进行表单提交  阻止表单的默认行为  注册success.form.bv  然后进行ajax的提交
  $('#form').on( 'success.form.bv', function ( e ) {
    //阻止默认行为
    e.preventDefault();

    //发送ajax请求
    $.ajax({
      type : 'post',
      url : '/employee/employeeLogin',
      data : $('#form').serialize(),
      dataType : 'json',
      success : function ( info ) {
        if ( info.success ) {
          //登录成功
          location.href = "index.html";
        }
        if ( info.error === 1000 ) {
          $('#form').data( 'bootstrapValidator' ).updateStatus( 'username', 'INVALID', 'callback');
        }
        if ( info.error === 1001 ) {
          $('#form').data( 'bootstrapValidator' ).updateStatus( 'password', 'INVALID', 'callback');
        }
      }
    }) 
  })


})