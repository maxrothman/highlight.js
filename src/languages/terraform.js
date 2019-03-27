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
      end: '=',
      excludeEnd: true
    },
    {
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
                  {begin: '\\b[a-zA-Z0-9_-]+\\('},
                  {begin: '\\)'}
                  
                ]
              }].concat(PRIMITIVES).concat([
                hljs.QUOTE_STRING_MODE,
                {
                  //functions
                  className: 'type',
                  begin: /\w+(\.\w+)+/
                }
              ])
            }
          ]
        }
      ])
    }
  ];

  var BLOCK = {
    begin: /^\s*\w+/,
    end: '}',
    className: 'keyword',
    contains: [
      hljs.QUOTE_STRING_MODE,  //block titles
      {
        begin: '{', end: '}',
        contains: BLOCK_BODY
      }
    ]
  }
  
  // Block bodies can contain other blocks
  BLOCK_BODY.push(BLOCK);
  
  return {
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      BLOCK
    ]
  }
}
