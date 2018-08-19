$( function () {

  //当前页
  var currentPage = 1;
  var pageSize = 5;


  var currentId;
  var isDelete;

  //已进入页面发送请求   请求数据库的数据  进行用户页面渲染
  render();
  function render () {
    $.ajax({
      type : 'get',
      url : '/user/queryUser',
      data : {
        page : currentPage,
        pageSize : pageSize
      },
      dataType : 'json',
      success : function ( info ) {
        //进行模板和数据相结合
        var htmlStr = template( 'tpl', info );
        //将htmlStr 添加到页面结构中
        $('.table tbody').html( htmlStr );
  
        // $('#paginator').bootstrapPaginator({
        //   bootstrapMajorVersion: 3,
        //   currentPage: 1,
        //   totalPages: 5
        // })
  
        //分页插件
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil( info.total / info.size ),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            //更新当前页
            currentPage = page;
            //重新渲染页面  发送ajax请求
            render();
          }
        });
      }
    })
  }


  //功能3 : 给所有的禁用启用按钮注册点击事件( 事件委托 )
  $('tbody').on( 'click', '.btn', function () {
    //显示模态框
    $('#userModal').modal('show');

    //存储id的值
    currentId = $(this).parent().data('id');
    //存储isDelete的值
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
  })

  //功能4 : 给模态框的确认按钮注册点击事件   
            //在点击事件中发送ajax请求修改isDelete的值   请求修改成功  关闭模态框  重新渲染当前页面
  $('#submitBtn').click( function () {
    //发送ajax请求到后台  进行修改状态
    $.ajax({
      type : 'post',
      url : '/user/updateUser',
      data : {
        id : currentId,
        isDelete : isDelete
      },
      dataType : 'json',
      success : function ( info ) {
        //判断是否修改成功
        if ( info.success ) {
          //关闭模态框
          $('#userModal').modal('hide');
          //重新渲染页面
          render();
        }
      }
    })
  })

})