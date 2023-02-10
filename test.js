const mensch = require('.');

var options = {comments: true}


const cssString = `
@supports (clip-path: polygon(0 0, 100% 5px, 100% 100%, 0 100%)) or (-webkit-clip-path: polygon(0 0, 100% 5px, 100% 100%, 0 100%)){
    @media screen and (min-width: 570px){
         #pricing-new-page #plans .plan{
            margin-top:35px
        }
         #pricing-new-page #plans .plan:not(.featured) .plan-name{
            height:65px
        }
         #pricing-new-page #plans .plan.standard{
             clip-path:polygon(0 0, 100% 5px, 100% 100%, 0 100%);
             -webkit-clip-path:polygon(0 0, 100% 5px, 100% 100%, 0 100%)
        }
         #pricing-new-page #plans .plan.lite{
             clip-path:polygon(0 5px, 100% 0, 100% 100%, 0 100%);
             -webkit-clip-path:polygon(0 5px, 100% 0, 100% 100%, 0 100%)
        }
         #pricing-new-page #plans .plan.featured{
             box-shadow:0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
             z-index:1
        }
    }
}
@media screen and (max-width: 860px){
     #pricing-new-page #intro{
        padding-bottom:560px
    }
     #pricing-new-page #plans .plans-table{
        flex-wrap:wrap;
        transform:translateY(-600px);
        margin-bottom:-600px
    }
     #pricing-new-page #plans .all-plans{
        margin-top:0;
        width:100%
    }
     #pricing-new-page #plans .all-plans h4{
        font-size:1.5em
    }
     #pricing-new-page #plans .all-plan-features{
        display:flex;
        flex-wrap:wrap
    }
     #pricing-new-page #plans .all-plan-features dd{
        width:33%
    }
     #pricing-new-page #plans .plan{
        width:33.3333333333%
    }
     #pricing-new-page #plans .details{
        margin-left:11.1111111111%
    }
}
#random-element {
    height: 100%
}
`
const cssString2 = `
@supports (clip-path: polygon(0 0, 100% 5px, 100% 100%, 0 100%)) or (-webkit-clip-path: polygon(0 0, 100% 5px, 100% 100%, 0 100%)){
    @media screen and (min-width: 570px){
         #child1 {
            margin-top:35px
        }
    }
}
@media screen and (max-width: 860px){
     #child2 {
        padding-bottom:560px
    }
}
#child3 {
    height: 100%
}
`

const cssString3 = `
@media screen and (min-width: 570px){
        #child1 {
        margin-top:35px
    }
}
@media screen and (max-width: 860px){
     #child2 {
        padding-bottom:560px
    }
}
#child3 {
    height: 100%
}
`

var ast = mensch.parse(cssString2, options);
var css = mensch.stringify(ast, options);

// console.log(css);
