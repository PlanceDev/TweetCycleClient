import{u as v,b as o,p as S,n,c as t,A as _,a as c,d as l,e as y,f as $,g as b,h as d,i as h,j as w,k,l as C,L as R,m as D,P as I,t as a,o as N,S as L}from"./index-694452cd.js";const x=a("<h2>Reset Password</h2>"),E=a("<p></p>"),F=a("<p>Password has been successfully reset!</p>"),T=a("<div><p>Create and confirm your new password.</p></div>"),B=a("<div></div>");function q(){const p=v(),[u,m]=o(""),[g,f]=o(!1),[r,P]=o({pw:"",confirmPw:""}),i=e=>{P({...r(),[e.target.name]:e.target.value})},A=e=>{if(e.preventDefault(),["pw","confirmPw"].some(s=>!r()[s]))return n.error("All fields are required!");if(r().pw!==r().confirmPw)return n.error("Passwords do not match!");N.put(`${L}/auth/reset-password`,{token:u(),pw:r().pw,confirmPw:r().confirmPw}).then(s=>{if(s.status!==200)return n.error("Something went wrong! Please try again later.");n.success("Password successfully reset!"),f(!0),p("/auth/login")}).catch(s=>n.error("Something went wrong! Please try again later."))};return S(()=>{let e=new URLSearchParams(window.location.search).get("token");if(m(e),!u())return n.error("Invalid token!")}),t(I,{get children(){return[t(_,{get children(){return x.cloneNode(!0)}}),c(()=>c(()=>!!g())()?t(l,{get children(){return t(y,{get children(){return F.cloneNode(!0)}})}}):t(l,{get children(){return[T.cloneNode(!0),t($,{onSubmit:A,get children(){return[t(b,{get children(){return[t(d,{for:"pw",children:"Password"}),t(h,{autocomplete:"new-password",type:"password",name:"pw",get value(){return r().pw},onChange:e=>i(e)}),t(d,{for:"confirmPw",children:"Confirm Password"}),t(h,{autocomplete:"new-password",type:"password",name:"confirmPw",get value(){return r().confirmPw},onChange:e=>i(e)})]}}),(()=>{const e=B.cloneNode(!0);return w(e,t(k,{type:"submit",children:"Submit"})),e})()]}})]}})),t(C,{get children(){const e=E.cloneNode(!0);return w(e,t(R,{get children(){return t(D,{href:"/auth/login",children:"Sign In"})}})),e}})]}})}export{q as default};