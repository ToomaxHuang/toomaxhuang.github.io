import{T as e,O as u}from"./OrbitControls.b0c8d7dc.js";import{d as L,r as M,o as P,c as f,F as x}from"./index.5a6b6f59.js";const S=L({setup(v,F){const d=M(),n=new e.Scene,l=new e.AxesHelper(30);n.add(l),new e.PointLight("#fff",.5).position.set(2,3,4),new e.DirectionalLight("#fff",.8),new e.HemisphereLight("#fff","#FF0",.6);const r=new e.RectAreaLight("#fff",50,2,2);r.position.set(0,5,10),r.lookAt(new e.Vector3);const a=new e.SpotLight("#FFF",5,10,Math.PI*.25,.25,1);a.position.set(0,5,10),a.lookAt(new e.Vector3),n.add(a);const g=new e.PointLightHelper(a,.2);n.add(g);const s=new e.MeshStandardMaterial;s.metalness=.4,s.roughness=.8;const m=new e.Mesh(new e.PlaneBufferGeometry(10,15,8,8),s),w=new e.Mesh(new e.TorusBufferGeometry(1,.5,8,16),s);w.position.z=2,w.position.y=5;const c=new e.Mesh(new e.SphereBufferGeometry(1,16,16),s);c.position.set(-3,5,2),n.add(m,w,c);const i={width:window.innerWidth,height:window.innerHeight},o=new e.PerspectiveCamera(75,i.width/i.height,.01,100);o.position.set(0,0,10),n.add(o);let t,h;P(()=>{t=new e.WebGLRenderer({canvas:d.value}),t.setSize(i.width,i.height),t.setPixelRatio(Math.min(window.devicePixelRatio,2)),h=new u(o,t.domElement),p()}),window.addEventListener("resize",()=>{i.width=window.innerWidth,i.height=window.innerHeight,o.aspect=i.width/i.height,o.updateProjectionMatrix(),t==null||t.setSize(i.width,i.height),t==null||t.setPixelRatio(Math.min(window.devicePixelRatio,2))});const p=()=>{window.requestAnimationFrame(p),t==null||t.render(n,o),h==null||h.update()};return()=>f(x,null,[f("canvas",{ref:d},null)])}});export{S as default};
