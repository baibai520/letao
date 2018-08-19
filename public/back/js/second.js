$( function () {

  //当前页码
  var currentPage = 1;
  var pageSize = 5;



  //一进入页面  发送ajax请求  请求二级菜单的所有信息   进行页面渲染
  render();
  function render () {

    //发送ajax请求
    $.ajax({
      type : 'get',
      url : '/category/querySecondCategoryPaging',
      data : {
        page : currentPage,
        pageSize : pageSize
      },
      dataType : 'json',
      success : function ( info ) {
        console.log( info );
        //模板和数据进行交互
        var htmlStr = template( 'rdtpl', info );
        //添加到页面上
        $('.lt_content tbody').html( htmlStr );


        //进行页面初始化
        $('#paginator').bootstrapPaginator({
          //配置版本
          bootstrapMajorVersion : 3,
          //当前页
          currentPage : info.page,
          //总页数
          totalPages : Math.ceil( info.total / info.size ),
          //给每一个页码注册点击事件
          onPageClicked : function ( a, b, c, page ) {
            //更新当前页
            currentPage = page;
            //重新渲染页面
            render();
          }
        });
      }
    })
  }


  //功能 3 : 给添加分类按钮注册点击事件   在事件处理函数中  让模态框进行显示
  $('#addBtn').click( function () {
    //让模态框进行显示
    $('#addModal').modal('show');

    //一进入页面发送ajax请求   获取一级分类的所有数据
    $.ajax({
      type : 'get',
      url : '/category/queryTopCategoryPaging',
      data : {
        page : 1,
        pageSize : 100
      },
      dataType : 'json',
      success : function ( info ) {
        //将模板和数据相结合
        var htmlStr = template( 'catetpl', info );
        //渲染到页面上
        $('.dropdown-menu').html( htmlStr );
      }
    })
  })


  //功能4 : 给下拉框的a注册点击事件  在事件处理函数中获取当前a的文本信息   然后赋值给ul 事件委托
  $('.dropdown-menu').on( 'click', 'a', function () {
    //获取a的文本信息
    var text = $(this).text();
    //赋值给ul
    $('#dropdownMenu1 .txt').text( text );

  })

  //功能5 : 配置文件上传插件
  $('#fileupload').fileupload({
    //配置返回数据格式
    dataType : 'json',
    //图片上传完成后调用的回调函数
    done : function ( e, data ) {
      //获取到上传图片的地址
      imgUrl = data.result.picAddr;
      //赋值给imgBox中
      $('#imgBox img').attr( 'src', imgUrl );
    }
  })

  //功能6 : 给添加分类功能的模态框中的添加按钮注册点击事件    
  // $('#addSubmit').click( function () {

  //   //获取分类的id

  //   //发送ajax请求
  //   $.ajax({
  //     type : 'post',
  //     url : '/category/addSecondCategory',
  //     data : {
  //       brandName : $('#form').serialize(),
  //       categoryId : currentId,
  //       brandLogo : imgUrl, 
  //     }
  //   }) 
  // })


  //功能7 : 进行表单校验
  $('#form').bootstrapValidator({
     //2. 配置校验图标
     feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',    // 校验成功
    invalid: 'glyphicon glyphicon-remove',  // 校验失败
    validating: 'glyphicon glyphicon-refresh' ,// 校验中

    //配置字段
    fields : {
      //品牌名称
      brandName : {
        validators : {
          notEmpty : {
            message : '请输入二级分类名称'
          }
        }
      },
      //一级分类的id 
      categoryId : {
        validators : {
          notEmpty : {
            message : '请选择一级分类'
          }
        }
      },
      //图片上传的地址
      brandLogo : {
        validators : {
          notEmpty : {
            message : '请上传图片'
          }
        }
      }
    }
    },
  })


})