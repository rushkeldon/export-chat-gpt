const htmlBlocks = [
  `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
    <style>
        body, html {
            box-sizing: border-box;
            color: #1a1a1a;
            padding: 15px;
            background : #E4E6EB;
            font-family: "Ubuntu", "Helvetica Neue", Helvetica, Arial, sans-serif;
            -webkit-transform:translate3d( 0, 0, 0 );
            transform: translate3d(0, 0, 0);
        }

        *, *:before, *:after {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            -webkit-tap-highlight-color: rgba( 0, 0, 0, 0 );
            box-sizing: inherit;
            scroll-behavior: smooth;
            outline : none !important;
        }
        .indent {
        	color : #E4E6EB;
        }
        pre {
        	font-family: "Ubuntu", "Helvetica Neue", Helvetica, Arial, sans-serif;	
        }
        .who {
            font-weight : bold;
        }
        .prompt {
            padding-left : 5px;
        }
        .response {
            padding-left : 5px;
        }
        .btn-copy {
        	position : absolute;
			top: -21px;
			left: -19px;
        	height : 35px;
        	border : 2px solid black;
        	border-radius : 3px;
        	color : black;
        	background : lightGray;
        	text-align : center;
        	line-height : 35px;
        	font-family : "Courier New";
        	font-weight : bold;
        	padding : 0px 15px;
    		user-select : none;
    		transition: background-color 0.25s ease;
        }
        .btn-copy:hover {
        	background : darkGray;
        }
		button {
			display : none;
		}
		code {
			border-radius : 6px;
		}
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-light.min.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
    <script>
    function copyToClipboard(){
    	const btnCopy = document.querySelector( '.btn-copy' );
    	btnCopy && btnCopy.parentNode && btnCopy.parentNode.removeChild( btnCopy );
    	
	    const r = document.createRange();
	    r.selectNode(document.querySelector( 'body'));
	    window.getSelection().removeAllRanges();
	    window.getSelection().addRange(r);
	    try {
	        document.execCommand('copy');
	        window.getSelection().removeAllRanges();
	        console.log('copied convo to clipboard');
	    } catch (err) {
	        console.log('error copying to clipboard!');
	    }
	    
	    document.body.appendChild( btnCopy );
	}
    </script>
</head>
<body contentEditable="true">
<div class="btn-copy" onclick="copyToClipboard()">copy to clipboard</div>
`,
  `
</body>
</html>
`
];

// options for the observer (which mutations to observe)
const mutationObserverConfig = {
  attributes: true,
  childList: true,
  subtree: true
};

// create an observer instance linked to the callback function
const observer = new MutationObserver( mutated );

function whenDOMready(func){
  switch (document.readyState + "") {
    case "complete":
    case "loaded":
    case "interactive":
      func();
      break;
    default:
      window.addEventListener("DOMContentLoaded", function (e) {
        func();
      });
  }
}

function hasConvo() {
  return !!document.querySelector( '.min-h-\\[20px\\]' );
}

function removeConvoDiv() {
  const div = document.querySelector( '.convo-div' );
  div && div.parentNode && div.parentNode.removeChild( div );
  if( div ) div.innerHTML = '';
}

function getConvo() {
  if( !hasConvo() ) return alert( 'no conversation loaded at this time' );
  const msgElements = document.querySelectorAll( '.min-h-\\[20px\\]' );
  const msgs = [];
  for( let i=0; i<msgElements.length; i++ ){
    msgs.push( msgElements[i].innerHTML );
  }


  const html = convoToHTML( msgs );
  console.log( html );

  const div = document.createElement( 'div' );
  div.classList.add( 'convo-div' );

  const btnClose = document.createElement( 'div' );
  btnClose.classList.add( 'btn-close' );
  div.appendChild( btnClose );
  btnClose.addEventListener( 'click', removeConvoDiv );

  const iframe = document.createElement( 'iframe' );
  div.appendChild( iframe );
  iframe.srcdoc = html;

  document.body.appendChild( div );
  // const json = convoToJSON( msgs );
  // console.log( json );
  // save JSON file
}

function convoToHTML( msgs ){
  const indent = `<span class="indent">></span>`;
  if( !msgs || !msgs.length ) return alert( 'no conversation loaded at this time' );
  let convo = '';
  for( i=0; i<msgs.length; i++ ){
    if( i%2 === 0 ){
      convo += `<p style="font-weight:bold" class="who me">me :</p>\n${indent}<span class="prompt">${msgs[ i ]}</span><br/>\n`;
    } else {
      convo += `<p style="font-weight:bold" class="who ai">ChatGPT:</p>\n${indent}<span class="response">${msgs[ i ]}</span><br/>\n`;
    }
  }
  return htmlBlocks[0] + convo + htmlBlocks[1];
}

function convoToJSON( msgs ){
  if( !msgs || !msgs.length ) return alert( 'no conversation loaded at this time' );
  const convo = msgs.map( (msg, i) => {
    switch( true ){
      case i%2 === 0 : // prompt
        return {
          from : 'me',
          msg : msg
        };
      default : // response
        return {
          from : 'chatGPT',
          msg : msg
        }
    }
  } );
  return JSON.stringify( convo, null, 2 );
}

function hasBtnConvo() {
  return !!document.querySelector( '.btn-get-convo');
}

function addBtnConvo() {
  hasBtnConvo() && removeBtnConvo();
  const btn = document.createElement( 'div' );
  btn.innerHTML = 'export';
  btn.className = 'btn1 btn-get-convo';
  document.body.appendChild( btn );
  btn.addEventListener( 'click', getConvo );
}

function removeBtnConvo() {
  const btn = document.querySelector( '.btn-get-convo');
  btn && btn.parentNode && btn.parentNode.removeChild( btn );
}

function addBtnInit() {
  const btn = document.createElement( 'div' );
  btn.innerHTML = 'init';
  btn.className = 'btn1 btn-init';
  document.body.appendChild( btn );
  btn.addEventListener( 'click', init );
}

function init() {
  const intitialPrompt = 'Please make your responses brief and refrain from explaining your limitations.';
  const form = document.querySelector( 'form' );
  if( form ){
    const msgTxtArea = form.querySelector( 'textarea' );
    if( msgTxtArea ){
      msgTxtArea.value = intitialPrompt;
      msgTxtArea.dispatchEvent( new Event( 'input', { bubbles: true } ) );
    } else {
      window.requestAnimationFrame( init );
    }
  }
}

// callback function to execute when mutations are observed
function mutated( mutationsList, observer ) {
  for( let mutation of mutationsList ) {
    // console.log( 'mutation.type :', mutation.type );
    switch( mutation.type ) {
      case 'attributes' :
        // console.log( 'Changed attribute name : ', mutation.attributeName );
        break;
      case 'childList' :
        // console.log( 'A child node has been added or removed.' );
        if( hasConvo() ){
          observer.disconnect();
          addBtnConvo();
        }
        break;
    }
  }
}

function domReady() {
  addBtnInit();
  observer.observe(document.querySelector( 'body' ), mutationObserverConfig)
}

// start observing the target node for configured mutations
whenDOMready( domReady  );
