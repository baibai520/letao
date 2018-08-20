$( function () {


  var currentPage = 1;
  var pageSize = 5;

  var picArr = [];

  //一进入页面发送请求
  render();
  function render () {

    //发送ajax请求
    $.ajax({
      type : 'get',
      url : '/product/queryProductDetailList',
      data : {
        page : currentPage,
        pageSize : pageSize
      },
      dataType : 'json',
      success : function ( info ) {
        //准备模板和数据相结合
        var htmlStr = template( 'proTpl', info );
        //添加到页面上
        $('.lt_content tbody').html( htmlStr );


        //分页初始化
        $('#paginator').bootstrapPaginator({
          //配置版本
          bootstrapMajorVersion : 3,
          //当前页
          currentPage : info.page,
          //总页数
          totalPages : Math.ceil( info.total / info.size ),
          //添加点击
          onPageClicked : function ( a, b, c, page ) {
            //更新当前页
            currentPage = page;
            //重新渲染页面
            render();
          }
        })
      }
    })
  }


  //给添加分类注册点击事件  在事件处理函数中显示模态框
  $('#addBtn').click( function () {
    //模态框显示
    $('#addModal').modal('show');

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
        //将模板和数据相结合
        var htmlStr = template( 'dropdownTpl', info );
        //将HTMLStr添加到结构中
        $('.dropdown-menu').html( htmlStr );
      }
    })

  })


  //给dropdown-menu下面的a 注册点击事件   通过事件处理函数
  $('.dropdown-menu').on( 'click', 'a', function () {
    //获取到a的TXT文本  将文本赋值给txt
    var text = $(this).text();
    $('.txt').text( text );

    //将获取到的id文本给到brandId
    var id = $(this).data('id');
    $('[name="brandId"]').val( id );
    

    //重置状态
    $('#form').data('bootstrapValidator').updateStatus( 'brandId', 'VALID'); 
  })

  //进行多文件上传初始化
  $('#fileupload').fileupload({
    //配置返回图片地址的格式
    dataType : 'json',
    //配置上传成功的回调函数
    done : function ( e, data ) {
      //data.result 是后台响应的结果

      //往数组中添加图片对象   从前面追加
      picArr.unshift( data.result );

      //动态创建img标签  从后面追加
      $('#imgBox').prepend('<img src="' + data.result.picAddr + '" alt="" style="width:100px">');

      //判断数组的长度如果大于3  就从最后一个进行移除  因为我们的图片只能放三张
      if ( picArr.length > 3 ) {
        //移除数组中的最后一项
        picArr.pop();
        //并且移除最后一个img结构
        $('#imgBox img:last-of-type').remove();

      }

      //如果图片长度大于三  name就让图片上传状态进行更新
      //在图片上传成功后重置图片上传状态
      if ( picArr.length === 3 ) {
        $('#form').data('bootstrapValidator').updateStatus( 'picStatus', 'VALID');
      }
      
    }
  })


  //进行表单校验
  $('#form').bootstrapValidator({
    // 重置排除项
    excluded: [],

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    //配置字段
    fields : {
      //二级分类
      brandId : {
        validators : {
          notEmpty : {
            message : '请选择二级分类'
          }
        }
      },
      //商品名称
      proName : {
        validators : {
          notEmpty : {
            message : '输入商品名称'
          }
        }
      },
      //商品描述
      proDesc : {
        validators : {
          notEmpty : {
            message : '请输入商品描述'
          }
        }
      },
      //商品库存
      num : {
        validators : {
          notEmpty : {
            message : '请输入商品库存'
          },
          regexp : {
            regexp : /^[1-9]\d*$/,
            message : "商品库存必须是非零开头的数字"
          }
        }
      },
      //商品尺码
      size : {
        validators : {
          notEmpty : {
            message : '请输入商品尺码'
          },
          regexp : {
            regexp : /^\d{2}-\d{2}$/,
            message : "尺码必须是 xx-xx 的格式, 例如: 32-40"
          }
        }
      },
      //商品原价
      oldPrice : {
        validators : {
          notEmpty : {
            message : '请输入商品原价'
          }
        }
      },
      //商品现价
      price : {
        validators : {
          notEmpty : {
            message : '请输入商品现价'
          }
        }
      },
      
      //上传图片状态
      picStatus : {
        validators : {
          notEmpty : {
            message : '请选择三张图片'
          }
        }
      }
    }

  })


  //阻止表单的默认行为  改为ajax请求进行提交
  $('#form').on( 'success.form.bv', function ( e ) {
    //阻止默认行为
    e.preventDefault();

    //获取表单元素使用name提交的信息
    var parmaStr = $('#form').serialize();

    // 还需要拼接上图片的数据
    // &picName1=xx&picAddr1=xx
    // &picName2=xx&picAddr2=xx
    // &picName3=xx&picAddr3=xx

    parmaStr += '&picName1=' + picArr[0].picName+ '&picAddr1=' + picArr[0].picAddr;
    parmaStr += '&picName2=' + picArr[1].picName+ '&picAddr2=' + picArr[1].picAddr;
    parmaStr += '&picName3=' + picArr[2].picName+ '&picAddr3=' + picArr[2].picAddr;

    //发送ajax请求
    $.ajax({
      type : 'post',
      url : '/product/addProduct',
      data : parmaStr,
      dataType : 'json',
      success : function ( info ) {
        //判断是否添加成功
        if ( info.success ) {
          //关闭模态框
          $('#addModal').modal('hide');
          //更新当前页为第一页
          currentPage = 1;
          //重新选人页面
          render();
          //重置表单文本 和 状态
          $('#form').data('bootstrapValidator').resetForm( true );

          //重置按钮文本
          $('.txt').text('请输入二级分类');
          //重置图片
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    })
  })
})