/*
Language: Terraform
Category: common
*/

function(hljs) {
  var PRIMITIVES = [
    {
      className: 'literal',
      begin: /(false|true)/
    },
    hljs.C_NUMBER_MODE
  ]
  return {
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        // blocks
        beginKeywords: 'resource data module provider terraform variable output',
        end: '}',
        contains: [
          hljs.QUOTE_STRING_MODE,     //block titles
          {
            // the block iteslf
            begin: '{',
            end: '}',
            contains: [
              hljs.HASH_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              {
                //key
                className: 'attribute',
                begin: /^\s*\w+/,
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
                          contains: [
                            {
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
                              },
                            ])
                          }
                        ]
                      }
                    ])
                  }
                ]
              }
            ]
          }
        ]
      }
    }
    