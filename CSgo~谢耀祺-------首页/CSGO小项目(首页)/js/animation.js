

/**匀速动画封装
 * @param: ele:元素
 * @param: target:目标位置
 */
function animationMove(ele, target) {
    //1.先清除之前的定时器，以本次为准
    clearInterval(ele.timeID);
    //2.开始本次移动
    ele.timeID = setInterval(function () {
        //2.1 获取元素当前位置
        var currentLeft = ele.offsetLeft;
        //2.2 开始移动
        var isLeft = currentLeft <= target ? true : false;
        isLeft ? currentLeft += 15 : currentLeft -= 15;
        ele.style.left = currentLeft + 'px';
        //2.3 边界检测
        if (isLeft ? currentLeft >= target : currentLeft <= target) {
            //(1)停止定时器
            clearInterval(ele.timeID);
            //(2)元素复位
            ele.style.left = target + 'px';
        };
    }, 10);
};


/**缓动动画封装
         * @parma: ele:移动元素
         * @parma: attrs:要移动的属性对象
         * @parma: fn 回调函数: 如果传了代码，动画结束之后帮你执行这段代码。没传不执行
         */
function animationSlow(ele, attrs, fn) {
    //1.先清除以前的定时器，以本次为准
    clearInterval(ele.timeID);
    //2.开始本次移动
    ele.timeID = setInterval(function () {
        /*开关思想
        1.提出假设 var isAllOk = true
        2.验证假设
        3.根据开关结果实现需求 
         */
        //1：提出假设
        var isAllOk = true;
        //2：验证假设
        //遍历对象的属性
        for (var key in attrs) {
            var attr = key;
            var target = attrs[key];
            if (attr == 'zIndex' || attr == 'backgroundColor') {
                //层级没有动画
                ele.style[attr] = target;
            } else if (attr == 'opacity') {//由于透明度与一般属性区别比较大，所以透明度单独逻辑
                //2.1.获取元素当前位置
                //注意点： 透明度使用parseFloat转换number，放大100倍
                var current = parseFloat(getStyle(ele, attr)) * 100;
                target *= 100;
                //2.2.计算本次移动距离 = （目标位置 - 当前位置）/10
                var step = (target - current) / 10;
                //取整：  step正数：向上取整 从左往右   step是负数：从下取整 从右往左
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                //2.3.开始移动
                current += step;
                ele.style[attr] = current / 100;//透明度没有单位
                //开关思想第二步：如果有任何属性没有到达终点则假设被推翻
                if (current != target) {
                    isAllOk = false;
                };
            } else {
                //2.1.获取元素当前位置
                //注意点： getComputerStyle获取的是字符串，需要使用parseInt转成number类型
                var current = parseInt(getStyle(ele, attr));
                //2.2.计算本次移动距离 = （目标位置 - 当前位置）/10
                var step = (target - current) / 10;
                //取整：  step正数：向上取整 从左往右   step是负数：从下取整 从右往左
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                //2.3.开始移动
                current += step;
                ele.style[attr] = current + 'px';
                //开关思想第二步：如果有任何属性没有到达终点则假设被推翻
                if (current != target) {
                    isAllOk = false;
                };
            }
        };
        //3：根据开关结果实现需求
        if (isAllOk) {
            clearInterval(ele.timeID);
            //如果调用者传递了第三个参数，并且是函数类型则执行函数体代码
            if (typeof fn == 'function') {
                fn();
            };
        };
    }, 20);
};

/*IE8兼容性封装
    @parma： ele：元素
    @parma: attribute:属性名字符串
    @return: 属性值 
 */

function getStyle(ele, attribute) {
    //能力检测
    //判断window对象有没有这个方法:对getComputedStyle属性取值，如果能和转成true说明存在这个方法
    if (window.getComputedStyle) {//谷歌火狐
        var style = window.getComputedStyle(ele, null);
        // return style.attribute;//点语法获取attribute属性值 : undefined
        return style[attribute];//字符串语法取attribute变量中对应字符串属性值
    } else {//IE8
        return ele.currentStyle[attribute];


    }
};

function burst(ele,box,a) {
    // ready 用来避免高频率的产生动画效果
    var ready = true;
    // 容器
    var img = ele;
    // 动画时间,单位是s
    var S = 1;
    // 每行 R 个 碎片
    var R = 4;
    // 每列 C 个 碎片
    var C = 7;
    // 容器宽度
    var W = parseInt(window.getComputedStyle(img)['width']);
    // 容器高度
    var H = parseInt(window.getComputedStyle(img)['height']);
    // 控制碎片的范围
    var N = 2;
    // 碎片分散时，整个活动范围的宽
    var maxW = N * W;
    // 碎片分散时，整个活动范围的高
    var maxH = N * H;
    // 控制显示第 now 张图片
    var now = 0;
    // 保存图片路径的数组
    var imgArr = [
        './首页图片/1.png',
        './首页图片/2.png',
        './首页图片/3.png',
        './首页图片/4.png',
    ];
    // img.style.background = 'url(' + imgArr[0] + ') no-repeat';
    var next = function () {
        return (now + 1) % imgArr.length;
    }

    

   
    box[a].addEventListener('mouseleave', function ()  {
        // 如果ready 为false 不产生动画效果
        if (!ready) return;
        ready = false;
        // 创建文档片段
        var html = document.createDocumentFragment();

        if (now + 1 >= imgArr.length) {
            img.style.background = 'url(' + imgArr[0] + ') no-repeat';
        } else {
            img.style.background = 'url(' + imgArr[now + 1] + ') no-repeat';
        }
        // posArr 用来保存每个碎片的初始位置和结束位置，
        var posArr = [];
        var k = 0;
        
        // 生成一定数量的小div元素，覆盖在容器上
        for (var i = 0; i < R; i++) {
            for (var j = 0; j < C; j++) {
                posArr[k] = {
                    // left 代表碎片初始时的 left 值
                    left: W * j / C,
                    // top 代表碎片初始时的 top 值
                    top: H * i / R,
                    // endLeft 代表动画结束时的 left 值
                    endLeft: maxW * j / C - (maxW - (maxW - W) / C - W) / 2,
                    // endTop 代表动画结束时的 top 值
                    endTop: maxH * i / R - (maxH - (maxH - H) / R - H) / 2,
                    // (maxW-(maxW-W)/C-W)/2 和 (maxH-(maxH-H)/R-H)/2 是为了让碎片能在容器的周围散开
                };

                // 创建一个div，一个div就是一个碎片
                var debris = document.createElement("div");
                // url 用来表示碎片的背景图的路径
                var url = imgArr[now];
                // 初始时，碎片的样式
                debris.style.cssText = `
                    position: absolute;
                    width: ${Math.ceil(W / C)}px;
                    height: ${Math.ceil(H / R)}px;
                    background: url(${url}) -${posArr[k].left}px -${posArr[k].top}px  no-repeat;
                    left: ${posArr[k].left}px;
                    top: ${posArr[k].top}px;
                    opacity:1;
                    transition:${randomNum(0.1, S)}s ease;
                    `;
                // 把创建的每个div，添加到文档片段中
                html.appendChild(debris);
                k++;
            }
        }
        // 把文档片段 加到DOM树中
        img.appendChild(html);

        // 获取容器的所有子元素，也就是所有的碎片
        var debrisAll = img.children;
        // 改变每个碎片样式，实现动画效果
        setTimeout(function () {
            for (var i = 0; i < debrisAll.length; i++) {
                var l = posArr[i].endLeft;
                var t = posArr[i].endTop;
                debrisAll[i].style.cssText += `
                    left : ${l}px;
                    top : ${t}px;
                    opacity :0;
                    transform:perspective(500px) rotateX(${randomNum(-180, 180)}deg) rotateY(${randomNum(-180, 180)}deg) rotateZ(${randomNum(-180, 180)}deg) scale(${randomNum(1.5, 3)});
                `;
            }
            // 动画效果完成后
            // 删除碎片
            // 把ready 设置为true，可以再次产生动画效果
            // 改变 now的值，也就是改变当前要显示的图片
            setTimeout(function () {
                img.innerHTML = '';
                ready = true;
                now = next();
            }, S * 1000);

        }, 50);
    },false)

    // 产生一个 n - m 之间的随机数
    function randomNum(n, m) {
        return Math.random() * (m - n) + n;
    }
}