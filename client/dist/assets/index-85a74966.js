import{b as o,c as t,A as f,a as s,d as c,e as v,L as u,f as A,g as y,h as _,i as $,j as d,k as S,l as P,m as b,P as E,t as r,n as i,o as k,S as D,q as N}from"./index-129ecd63.js";const C=r("<h2>Verify Email</h2>"),I=r("<p>Already have an account? </p>"),L=r("<span>A verification link has been sent to your email address.<p>If you did not receive an email, please check your spam folder.</p></span>"),V=r("<span>Resend verification email</span>"),w=r("<div><p>Please enter your email address to receive a verification email.</p></div>"),x=r("<div></div>");function F(){const[m,l]=o(!0),[a,h]=o({email:""}),p=e=>{h({...a(),[e.target.name]:e.target.value})},g=e=>{if(e.preventDefault(),["email"].some(n=>!a()[n]))return i.error("Email is required!");k.post(`${D}/auth/resend-email`,a()).then(n=>{console.log(n),i.success("Verification email sent!"),l(!0)}).catch(n=>i.error("Something went wrong! Please try again later."))};return t(E,{get children(){return[t(f,{get children(){return C.cloneNode(!0)}}),s(()=>s(()=>!!m())()?t(c,{get children(){return t(v,{get children(){return[L.cloneNode(!0),t(u,{get children(){const e=V.cloneNode(!0);return e.$$click=()=>l(!1),e.style.setProperty("cursor","pointer"),e}})]}})}}):t(c,{get children(){return[w.cloneNode(!0),t(A,{onSubmit:g,get children(){return[t(y,{get children(){return[t(_,{for:"email",children:"Email"}),t($,{autocomplete:"new-password",type:"email",name:"email",get value(){return a().email},onChange:e=>p(e)})]}}),(()=>{const e=x.cloneNode(!0);return d(e,t(S,{type:"submit",children:"Submit"})),e})()]}})]}})),t(P,{get children(){const e=I.cloneNode(!0);return e.firstChild,d(e,t(u,{get children(){return t(b,{href:"/auth/login",children:"Login"})}}),null),e}})]}})}N(["click"]);export{F as default};
