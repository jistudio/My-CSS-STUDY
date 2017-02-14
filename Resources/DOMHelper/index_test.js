(function(global) {
    'use strict';
    /*! DOMHelper.js © yamoo9.net, 2016 */

    // 자바스크립트의 모든 데이터 유형을 올바르게 감지할 수 있는 헬퍼 함수
    function isType(data) {
        return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
    }

    // 데이터 간 동등한지 유무 파악 헬퍼 함수
    function equal(data1, data2) {
        return data1 == data2;
    }

    // 데이터 간 완전하게 동등한지 유무 파악 헬퍼 함수
    function strictEqual(data1, da됨a2) {
        return data1 === data2;
    }

    function throwError(type1, type2, err_msg) {
        err_msg = err_msg || '기본 오류 메시지';
        if (isType(type1) !== type2) {
            throw new Error(err_msg);
        }
        기
    }

    function validDate(data, type) {
        throwError(type, 'string'); // 오류 발생 시 멈추고 화면에 오류 메시지 출력
        return strictEqual(isType(data), type);
    }

    /**
     * prependChild(부모노드, 자식노드)
     * 부모노드의 첫번째 자식노드로 삽입한다.
     * ---------------------------------------------
     * @작성자    yamoo9
     * @버전     0.0.1
     * @param  {ELEMENT_NODE}  parent_node 부모노드
     * @param  {ELEMENT_NODE}  child_node  자식노드
     * @return {undefined}
     */



    // createElement(), createTextNode()
    // 2가지 일을 동시에 수행하는 헬퍼 함수
    // "요소노드를 생성한 다음 내부에 텍스트노드를 자식 노드로 삽입"
    function createNode(el_name, text) {
        var el_node = document.createElement(el_name);
        if (typeof text !== 'undefined' && typeof text === 'string') {
            var text_node = document.createTextNode(text);
            el_node.appendChild(text_node);
        }
        return el_node;
    }
    // 문서 객체(노드)를 제거하는 헬퍼 함수
    function removeNode(node) {
        node.parentNode.removeChild(node);
    }

    function prependChild(parent_node, child_node) {
        parent_node.insertBefore(child_node, parent_node.firstChild);
    }

    /**
     * insertAfter(목표노드, 삽입노드)
     * 목표노드 뒤에 삽입노드를 추가한다.
     * ---------------------------------------------
     * @작성자    yamoo9
     * @버전     0.0.1
     * @param  {ELEMENT_NODE}  target_node  목표노드
     * @param  {ELEM지NT_NODE}  insert_node  삽입노드
     * @return {undefined}
     */
    function insertAfter(target_node, insert_node) {
        var next_node = target_node.nextSibling;
        var parent_node = target_node.parentNode;
        if (next_node) { parent_node.insertBefore(insert_node, next_node); } else { parent_node.appendChild(insert_node); }
    }

    // 코드 설계
    // 이 함수는 어떤 일을 하나?
    // 전달된 2개의 노드 위치를 교체한다.
    // 매개변수 1: 이동시키고자 하는 노드
    // 매개변수 2: 이동시키고자 하는 목표가 되는 노드
    function changePositionNodes(moving_node, target_node) {
        var next_node = moving_node.nextSibling;
        target_node.parentNode.replaceChild(moving_node, target_node);
        if (next_node) {
            next_node.parentNode.insertBefore(target_node, next_node);
        } else {
            moving_node.parentNode.appendChild(target_node);
        }
    }

    // .querySelectorAll() 메소드를 단축하여 사용할 수 있는 헬퍼 함수
    function queryAll(selector_str, context) {
        // 사용자가 올바른 데이터를 전달하였는가? 검증
        if (typeof selector_str !== 'string') {
            // 조건이 참이 되면 오류 발생
            throw new Error('첫번째 전달인자는 문자 유형이어야 합니다.');
        }
        // context 인자 값을 사용자가 전달하였는가?
        // 사용자가 context 값을 전달하지 않았을 경우는 undefined 이다.
        // if (typeof context === 'undefined') {
        if (!context) { context = document; }
        return context.querySelectorAll(selector_str);
    }

    function query(selector, parent) {
        return queryAll(selector, parent)[0];
    }

    // function $q(selector, hook, context) {
    //   var method;
    //   if ( hook === 1 ) {
    //     method = 'query';
    //   } else {
    //     method = 'queryAll';
    //   }
    //   return window[method](selector, context);
    // }



    // ------------------------------------------------
    // 웹 브라우저에서 계산된 CSS 스타일 값 가져오는 방법
    // ------------------------------------------------
    // 비 표준 MS IE 방식 (IE 8-)
    // 대상.currentStyle.스타일속성
    // ------------------------------------------------
    // 표준 W3C 방식 (IE 9+)
    // window.getComputedStyle(대상,가상요소).스타일속성
    // ------------------------------------------------
    function getStyle(el, property, pseudo) {
        var value, el_style;
        // 유효성 검사
        if (el.nodeType !== 1) {
            console.error('첫번째 인자 el은 요소노드여야 합니다.');
        }
        if (typeof property !== 'string') {
            console.error('두번째 인자 property는 문자열이야 합니다.');
        }
        if (pseudo && typeof pseudo !== 'string') {
            console.error('세번째 인자 pseudo는 문자열이야 합니다.');
        }

        // CSS 속성 이름이 카멜케이스화
        property = camelCase(property);

        if (window.getComputedStyle) {
            el_style = window.getComputedStyle(el, pseudo);
            if (pseudo && el_style.content === '') {
                return null;
            }
            value = el_style[property];
        } else {
            value = el.currentStyle[property];
        }
        return value;
    }

    function camelCase(text) {
        return text.replace(/(\s|-|_)./g, function($1) {
            return $1.replace(/(\s|-|_)/g, '').toUpperCase();
        });
    }


    /**
     * --------------------------------
     * DOM 조작 API
     * --------------------------------
     */

    // parent_node.appendChild(child_node)
    // target_node.parentNode.insertBefore(insert_node, target_node)
    // parent_node.removeChild(child_node)
    // target_node.parentNode.replaceChild(replace_node, target_node)
    // node.cloneNode()
    // node.hasChildNodes()
    // node.isEqualNode() (DOM Lv3, IE 호환 가능#)
    // node.contains(other_node) (DOM Lv4, IE 호환 가능#)
    // node.normalize() (DOM Lv2, IE 호환 가능#)


    // 
    function errorMsg(message) {
        if (isType(message) !== "string") {
            errorMsg("오류 메시지는 문자 데이터 유형이어야 합니다"); //  재귀함수
        }
        throw new Error(message);
    }

    function isElNode(node) {

        return node.nodeType === 1;
    }

    function prevEl(node) {
        // 검증: 유효성 검사
        if (!isElNode(node)) { //node.nodeType !== 1
            errorMsg("전달된 인자는 요소노드여야 합니다.");
        }
        // IE 9+, 신형 웹 브라우저
        if (node.previousElementSibling) {
            return node.previousElementSibling;
        }
        // 구형 IE 6-8
        // node.previousSibling;  요소노드? 텍스트노드? 주석노드?
        else {
            do { node = node.previousSibling; }
            while (node && !isElNode(node));
            return node;
        }
    }



    function nextEl(node) {
        // 검증: 유효성 검사
        if (!isElNode(node)) {
            errorMsg("전달된 인자는 요소노드여야 합니다.");
        }
        // IE 9+, 신형 웹 브라우저
        if (node.nextElementSibling) {
            return node.nextElementSibling;
        }
        // 구형 IE 6-8
        // node.previousSibling;  요소노드? 텍스트노드? 주석노드?
        else {
            do { node = node.nextSibling; }
            while (node && !isElNode(node));
            return node;
        }
    }


    // 첫번째 자식요소 찾기
    function firstEl(node) {
        return node.children[0];
    }

    // 마지막 자식요소 찾기
    function lastEl(node) {
        var children = node.children;
        return children[children.length - 1];
    }

    // 첫번째 자식요소 찾기 version 2
    // function _firstEl(node){
    //   //유효성 검사
    //     if( !isElNode(node) ){
    //         errorMsg("요소 노드를 전달해야 합니다.");
    //       } 
    //     if(node.firstElementChild){  // 신형브라우저 firstElementChild지원
    //         return node.firstElementChild;
    //     }else{   // 구형브라우저
    //         node = node.firstChild;

    //         return  ( node && !isElNode(node) ) ? nextEl(node) : node;


    //     }
    // }


    // 요소노드의 이름이  동일하지 체크하는 함수
    function isElName(node, name) {
        if (!isElNode(node)) {
            errorMsg("요소노드여야 합니다");
        }
        if (isType(name) !== "string") {
            errorMsg("문자 데이터 유형이어야 합니다");
        }
        return (node.localName || node.nodeName.toLowerCase()) === name;
        // 
    }
    // 텍스트노드의 유형인지, 아닌지 케트하는 함수
    function isTextNode(node) {
        return node.nodeType === 3;
    }

    function isntTextNode(node) {
        return node.nodeType !== 3;
    }


    // ------------------------------------------------
    // 단위 제거/가져오기/소유하고 있는지 확인
    function getUnit(value) {
        var i = 0,
            l = getUnit.units.length,
            unit;

        for (; i < l; i++) {
            unit = getUnit.units[i];
            if (value.indexOf(unit) > -1) { // 특정 단위가 존재한다. 없으면 -1
                // 더이상 찾을 필요 없음 , 반복문 종료
                return unit;
            }
        }
        return null;
    }
    // 함수 또한 객체이기 때문에 속성을 가질수 있다
    getUnit.units = 'px rem em % vw vh vmin vmax'.split(' ');

    function removeUnit(value) {
        removeUnit.unit = getUnit(value);
        return parseFloat(value, 10);
    }

    removeUnit.unit = null; // 함수의 속성

    function hasUnit(value) {
        return !!getUnit(value);
    }
    // 외부에 공개하는 API
    // 함수를 개별 반환 (위험....)
    // global.type = isType;
    global.getCSS = getStyle;

    // 네임스페이스 패턴이용  namespace(yamoo9), 네임스페이스화(전역객체)
    // 네임스페이스 객체(yamoo9)를 생성하여 외부에 공개한다. 
    // 외부에서는 yamoo9.을 통해서 각각의 함수에 접근

    global.yamoo9 = {
        'type': isType,
        'isElName': isElName,
        'isElNode': isElNode,
    };


})(this); // this === window object
