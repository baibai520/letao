$( function () {

  //当前页数 
  var currentPage = 1;
  //每页条数
  var pageSize = 5;

  //已经入页面发送ajax请求,请求一级分类数据进行页面渲染
  render();
  function render () {
    //发送ajax请求
    $.ajax({
      type : 'get',
      url : '/category/queryTopCategoryPaging',
      data : {
        page : currentPage,
        pageSize : pageSize
      },
      dataType : 'json',
      success : function ( info ) {
        console.log( info );
        //使用模板和数据进行交互
        var htmlStr = template( 'tpl', info );
        //添加到页面上
        $('.lt_content tbody').html( htmlStr );

        //进行分页初始化
        $('#paginator').bootstrapPaginator({
          //进行配置版本
          bootstrapMajorVersion : 3,
          //当前页
          currentPage : info.page,
          //共几页
          totalPages : Math.ceil( info.total / info.size ),
          //给每一个页码注册点击事件
          onPageClicked : function ( a, b, c, page ) {
            //更新当前页'
            currentPage = page;
            //重新渲染
            render();
          }
        })
      }
    })
  }

  //功能3 : 给添加分类按钮注册点击事件  在事件处理函数中显示模态框
  $('#addBtn').click( function () {
    //显示模态框
    $('#addModal').modal('show');
  })

  //功能4 : 添加表单校验功能
  $('#form').bootstrapValidator({
     //2. 配置校验图标
     feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    //配置字段
    fields : {
      categoryName : {
        //进行校验规则
        validators : {
          //非空校验
          notEmpty : {
            message : "请输入一级分类名称",
          }
        }
      }
    }
  })

  //功能5 : 阻止表单提交  使用ajax请求进行提交
  $('#form').on( 'success.form.bv', function ( e ) {
    //阻止默认的提交
    e.preventDefault();

    //发送ajax请求
    $.ajax({
      type : 'post',
      url : '/category/addTopCategory',
      data : $('#form').serialize(),
      dataType : 'json',
      success : function ( info ) {
        //判断是否注册成功
        if ( info.success ) {
          //关闭模态框
          $('#addModal').modal('hide');
          //重新渲染页面
          render();
          //重置表单的文本和状态
          $('#form').data('bootstrapValidator').resetForm(true);
        }
      }
    })
  })
})