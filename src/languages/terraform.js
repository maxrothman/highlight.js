/*
Language: Terraform
Category: common
*/

function(hljs) {
  function trace(msg, result) {
    console.log(msg);
    return result();
  }
  
  var PRIMITIVES = [
    {
      className: 'literal',
      begin: /(false|true)/
    },
    hljs.C_NUMBER_MODE
  ]
  
  var BLOCK_BODY = [
    hljs.HASH_COMMENT_MODE,
    hljs.C_BLOCK_COMMENT_MODE,
    {
      //key
      className: 'attribute',
      begin: /^\s*\w+/,
      end: /(?![^=])/,
      excludeEnd: true
    },
    {
      //value
      begin: '=\s*.',
      contains: PRIMITIVES.concat([  // values
        {
          //string
          className: 'string',
          variants: [
            {begin: '"', end: '"'},
            {begin: /<<EOF$/, end: /^EOF$/}  //hack hack
            
          ],
          illegal: '\\n',
          contains: [
            hljs.BACKSLASH_ESCAPE,
            {
              // interpolation
              className: 'subst',
              begin: /\$\{/,
              end: /\}/,
              contains: [{
                className: 'symbol',
                variants: [
                  //functions
                  {begin: /\b[a-zA-Z0-9_-]+\(/},
                  {begin: '\\)'}
                  
                ]
              }].concat(PRIMITIVES).concat([
                hljs.QUOTE_STRING_MODE,
                {
                  //references
                  className: 'type',
                  begin: /[a-zA-Z0-9_-]+(\.([a-zA-Z0-9_-]+|\*))+/
                }
              ])
            }
          ]
        }
      ])
    }
  ];

  var BLOCK = {
    begin: /^\s*\w+(\s+"\w+")*\s*\{/, returnBegin: true,
    end: '}', excludeEnd: true,
    contains: [
      hljs.QUOTE_STRING_MODE,  //block titles
      {
        begin: '{', end: '}',
        contains: BLOCK_BODY
      },
      {
        begin: /\w+/, end: /\s/,
        className: 'keyword'
      }
    ]
  }
  
  // Block bodies can contain other blocks
  BLOCK_BODY.splice(2, 0, BLOCK);
  
  return {
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      BLOCK
    ]
  }
}
