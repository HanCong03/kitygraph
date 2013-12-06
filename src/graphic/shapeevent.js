/*
 * 图形事件包装类
 * */

define( function ( require, exprots, module ) {

    var Matrix = require( "graphic/matrix" ),
        Utils = require( "core/utils" );

    return require( 'core/class' ).createClass( 'EventHandler', {

        constructor: function ( event ) {

            var target = null;

            // dom 事件封装对象
            if ( !Utils.isObject( event.target ) ) {

                target = event.target;

                // use标签有特殊属性， 需要区别对待
                if ( target.correspondingUseElement ) {

                    target = target.correspondingUseElement;

                }

                this.originEvent = event;
                this.targetShape = target.shape || target.paper;

                if ( event.__kity_param ) {

                    Utils.extend( this, event.__kity_param );

                }


            // 普通事件封装对象
            } else {

                Utils.extend( this, event );

            }

        },

        preventDefault: function () {

            var evt = this.originEvent;

            if ( !evt ) {
                return true;
            }

            if ( evt.preventDefault ) {

                evt.preventDefault();

                return evt.cancelable;

            } else {

                evt.returnValue = false;

                return true;

            }

        },

        //当前鼠标事件在用户坐标系中点击的点的坐标位置
        getPosition: function () {

            if ( !this.originEvent ) {
                return null;
            }

            var eventClient = this.originEvent.touches ?
                this.originEvent.touches[0] :
                this.originEvent;

            var clientX = eventClient.clientX,
                clientY = eventClient.clientY,
                paper = this.targetShape.getPaper(),
                //转换过后的点
                transPoint = Matrix.transformPoint( clientX, clientY, paper.node.getScreenCTM().inverse() );

            var zoom = paper.getViewPort().zoom;

            return {
                x: transPoint.x / zoom,
                y: transPoint.y / zoom
            };

        },

        stopPropagation: function () {

            var evt = this.originEvent;

            if ( !evt ) {
                return true;
            }

            if ( evt.stopPropagation ) {

                evt.stopPropagation();

            } else {

                evt.cancelBubble = false;

            }

        }

    } );

} );