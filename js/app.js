// 房屋与生活 - 完整应用逻辑
// 版本: 20260406

// ========== 工具函数 ==========
function toast(msg,type){
  var t=document.createElement('div');
  t.textContent=msg;
  t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:4px;z-index:9999;color:#fff;background:'+(type==='er'?'#e74c3c':'#27ae60')+';';
  document.body.appendChild(t);
  setTimeout(function(){t.remove();},3000);
}

function sm(id){var el=document.getElementById(id);if(el)el.classList.add('on');}
function cm(id){var el=document.getElementById(id);if(el)el.classList.remove('on');}

// ========== 用户系统 ==========
function getUsers(){
  try{return JSON.parse(localStorage.getItem('fangwu_users')||'{}');}catch(e){return {};}
}
function saveUsers(u){localStorage.setItem('fangwu_users',JSON.stringify(u));}
function getCurUser(){
  try{return JSON.parse(localStorage.getItem('fangwu_cur_user')||'null');}catch(e){return null;}
}

function doLogin(){
  var u=document.getElementById('loginUsername').value.trim();
  var p=document.getElementById('loginPwd').value;
  var users=getUsers();
  if(users[u]&&users[u].pwd===p){
    localStorage.setItem('fangwu_cur_user',JSON.stringify({name:u,phone:users[u].phone}));
    cm('loginModal');
    toast('登录成功！','ok');
    updateNavUser();
  }else{toast('用户名或密码错误','er');}
}

function doRegister(){
  var u=document.getElementById('regUsername').value.trim();
  var p=document.getElementById('regPwd').value;
  var ph=document.getElementById('regPhone').value.trim();
  if(!u||!p||!ph){toast('请填写完整信息','er');return;}
  if(p.length<6){toast('密码至少6位','er');return;}
  var users=getUsers();
  if(users[u]){toast('用户名已存在','er');return;}
  users[u]={pwd:p,phone:ph,date:new Date().toISOString().split('T')[0]};
  saveUsers(users);
  toast('注册成功！请登录','ok');
  cm('registerModal');
  sm('loginModal');
}

function updateNavUser(){
  // 更新导航用户状态
}

// ========== 个人发布系统 ==========
var USER_POSTS_KEY='fangwu_user_posts';
var currentPostType='fangchan';

function getUserPosts(type){
  try{var all=JSON.parse(localStorage.getItem(USER_POSTS_KEY)||'{}');return all[type]||[];}catch(e){return [];}
}

function saveUserPost(type,post){
  var all=JSON.parse(localStorage.getItem(USER_POSTS_KEY)||'{}');
  if(!all[type])all[type]=[];
  post.id='up'+Date.now();
  post.date=new Date().toISOString().split('T')[0];
  var cur=getCurUser();
  if(cur){post.author=cur.name;post.phone=cur.phone;}
  all[type].push(post);
  localStorage.setItem(USER_POSTS_KEY,JSON.stringify(all));
  toast('发布成功！','ok');
}

function showPostForm(type){
  currentPostType=type;
  var cur=getCurUser();
  if(!cur){sm('loginModal');return;}
  document.getElementById('postTitle').value='';
  document.getElementById('postDesc').value='';
  document.getElementById('postContact').value=cur.phone||'';
  document.getElementById('postPrice').value='';
  sm('postFormModal');
}

function submitPost(){
  var title=document.getElementById('postTitle').value.trim();
  var desc=document.getElementById('postDesc').value.trim();
  var contact=document.getElementById('postContact').value.trim();
  var price=document.getElementById('postPrice').value.trim();
  if(!title||!desc){toast('请填写标题和描述','er');return;}
  saveUserPost(currentPostType,{title:title,desc:desc,contact:contact,price:price});
  cm('postFormModal');
}

// ========== 页面渲染函数 ==========

// 首页
function renderHome(){
  var html='<div class="section"><h2>🔥 热门楼盘</h2><div class="card-list">';
  LOU_PAN.slice(0,6).forEach(function(item){
    html+='<div class="card"><h3>'+item.name+'</h3><p>📍 '+item.district+' | 🏫 '+item.xq+'</p>';
    html+='<p>💰 '+item.price+'元/平 | 🚗 '+item.tc+'元/月</p></div>';
  });
  html+='</div></div>';
  return html;
}

// 房产 - 带区域筛选
var currentDistrict='全部';
var currentTab='loupan';

function renderFangchan(){
  var html='<div class="section"><h2>🏠 房产信息</h2>';
  // 区域筛选
  html+='<div class="district-filter"><span>区域筛选：</span>';
  var districts=['全部','龙华区','秀英区','美兰区','琼山区'];
  districts.forEach(function(d,i){
    html+='<button class="district-btn '+(i===0?'on':'')+'" onclick="filterDistrict(\''+d+'\',this)">'+d+'</button>';
  });
  html+='</div>';
  // 标签切换
  html+='<div class="tabs"><button class="tab-btn '+(currentTab==='loupan'?'on':'')+'" onclick="switchTab(\'loupan\')">新楼盘</button>';
  html+='<button class="tab-btn '+(currentTab==='ershou'?'on':'')+'" onclick="switchTab(\'ershou\')">二手房</button></div>';
  // 内容区域
  html+='<div id="fangchanContent">'+(currentTab==='loupan'?renderLoupan(currentDistrict):renderErshou(currentDistrict))+'</div>';
  // 个人发布按钮
  html+='<div class="user-post-btn"><button class="btn btn-primary" onclick="showPostForm(\'fangchan\')">📝 个人发布</button></div>';
  return html;
}

function filterDistrict(district,btn){
  currentDistrict=district;
  document.querySelectorAll('.district-btn').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  var content=document.getElementById('fangchanContent');
  if(content){
    content.innerHTML=currentTab==='loupan'?renderLoupan(currentDistrict):renderErshou(currentDistrict);
  }
}

function switchTab(tab){
  currentTab=tab;
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('on');});
  event.target.classList.add('on');
  var content=document.getElementById('fangchanContent');
  if(content){
    content.innerHTML=tab==='loupan'?renderLoupan(currentDistrict):renderErshou(currentDistrict);
  }
}

function renderLoupan(district){
  var html='<div class="card-list">';
  var filtered=district==='全部'?LOU_PAN:LOU_PAN.filter(function(item){return item.district===district;});
  if(filtered.length===0){html+='<p class="empty">该区域内暂无楼盘信息</p>';}
  else{
    filtered.forEach(function(item){
      html+='<div class="card"><h3>'+item.name+'</h3><p>📍 '+item.district+' | 🏫 '+item.xq+'</p>';
      html+='<p>💰 '+item.price+'元/平 | 🚗 '+item.tc+'元/月</p><p>'+item.desc+'</p></div>';
    });
  }
  html+='</div>';
  return html;
}

function renderErshou(district){
  var html='<div class="card-list">';
  var filtered=district==='全部'?ERSHOU:ERSHOU.filter(function(item){return item.district===district;});
  if(filtered.length===0){html+='<p class="empty">该区域内暂无二手房源</p>';}
  else{
    filtered.forEach(function(item){
      html+='<div class="card"><h3>'+item.name+'</h3><p>📍 '+item.district+' | 📐 '+item.area+'</p>';
      html+='<p>💰 '+item.price+item.unit+' | 🚗 '+item.tc+'元/月</p><p>'+item.desc+'</p></div>';
    });
  }
  html+='</div>';
  return html;
}

// 土地
function renderTudi(){
  var html='<div class="section"><h2>🌍 土地信息</h2>';
  html+='<div class="district-filter"><span>区域筛选：</span>';
  var districts=['全部','龙华区','秀英区','美兰区','琼山区'];
  districts.forEach(function(d,i){
    html+='<button class="district-btn '+(i===0?'on':'')+'" onclick="filterTudi(\''+d+'\',this)">'+d+'</button>';
  });
  html+='</div><div id="tudiContent">'+renderTudiList('全部')+'</div>';
  html+='<div class="user-post-btn"><button class="btn btn-primary" onclick="showPostForm(\'tudi\')">📝 个人发布</button></div>';
  return html;
}

function filterTudi(district,btn){
  document.querySelectorAll('.district-btn').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  var content=document.getElementById('tudiContent');
  if(content)content.innerHTML=renderTudiList(district);
}

function renderTudiList(district){
  var html='<div class="card-list">';
  var filtered=district==='全部'?TUDI_DATA:TUDI_DATA.filter(function(item){return item.district===district;});
  if(filtered.length===0){html+='<p class="empty">该区域内暂无土地信息</p>';}
  else{
    filtered.forEach(function(item){
      html+='<div class="card"><h3>'+item.name+'</h3><p>📍 '+item.district+' | 📐 '+item.area+'亩</p>';
      html+='<p>💰 '+item.price+'万/亩 | 🏷 '+item.type+'</p><p>'+item.desc+'</p></div>';
    });
  }
  html+='</div>';
  return html;
}

// 电动车
function renderDianji(){
  var html='<div class="section"><h2>⚡ 电动车</h2><div class="card-list">';
  CAR_DATA.filter(function(c){return c.type==='电动车';}).forEach(function(item){
    html+='<div class="card"><h3>'+item.name+'</h3><p>🏷 '+item.brand+' | 💰 '+item.price+'万</p>';
    html+='<p>📍 '+item.district+'</p><p>'+item.desc+'</p></div>';
  });
  html+='</div>';
  html+='<div class="user-post-btn"><button class="btn btn-primary" onclick="showPostForm(\'diandongche\')">📝 个人发布</button></div>';
  return html;
}

// 网约车
function renderWangyueche(){
  var html='<div class="section"><h2>🚕 网约车</h2><div class="card-list">';
  WYCHE_DATA.forEach(function(item){
    html+='<div class="card"><h3>'+item.title+'</h3><p>'+item.content.substring(0,100)+'...</p>';
    html+='<p>📅 '+item.date+' | 👁 '+item.views+'</p></div>';
  });
  html+='</div>';
  html+='<div class="user-post-btn"><button class="btn btn-primary" onclick="showPostForm(\'wangyueche\')">📝 个人发布</button></div>';
  return html;
}

// 学车
function renderXueche(){
  var html='<div class="section"><h2>📚 学车信息</h2><div class="card-list">';
  XUECHE_DATA.filter(function(x){return x.type==='驾校'||x.type==='考场';}).forEach(function(item){
    html+='<div class="card"><h3>'+item.name+'</h3><p>📍 '+item.district+' | 💰 '+item.price+'</p>';
    html+='<p>'+item.desc+'</p></div>';
  });
  html+='</div>';
  return html;
}

// 生活 - 泰国洞燕
function renderShenghuo(){
  var html='<div class="section"><h2>🪺 生活健康 - 泰国洞燕</h2>';
  html+='<p style="margin-bottom:15px;color:#666;">精选泰国天然洞燕，滋补养生，品质保证</p>';
  html+='<div class="tabs"><button class="tab-btn on" onclick="switchShenghuoTab(\'yanwo\',this)">洞燕产品</button>';
  html+='<button class="tab-btn" onclick="switchShenghuoTab(\'zhishi\',this)">燕窝知识</button></div>';
  html+='<div id="shenghuoContent">'+renderYanwo()+'</div>';
  html+='<div class="user-post-btn"><button class="btn btn-primary" onclick="showPostForm(\'shenghuo\')">📝 个人发布</button></div>';
  return html;
}

function switchShenghuoTab(tab,btn){
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  var content=document.getElementById('shenghuoContent');
  if(content){
    content.innerHTML=tab==='yanwo'?renderYanwo():renderYanwoZhishi();
  }
}

function renderYanwo(){
  var html='<div class="card-list">';
  if(typeof YANWO_DATA!=='undefined'&&YANWO_DATA.length>0){
    YANWO_DATA.forEach(function(item){
      html+='<div class="card" style="border-left:3px solid #e8b4b8;"><h3>🪺 '+item.name+'</h3>';
      html+='<p>产地：'+item.origin+' | 规格：'+item.spec+'</p>';
      html+='<p>💰 '+item.price+'元 | 📦 库存：'+item.stock+'</p>';
      html+='<p style="color:#888;font-size:12px;">'+item.desc+'</p></div>';
    });
  }else{
    html+='<p class="empty">暂无洞燕产品信息</p>';
  }
  html+='</div>';
  return html;
}

function renderYanwoZhishi(){
  var html='<div class="card-list">';
  if(typeof YANWO_ZHISHI!=='undefined'&&YANWO_ZHISHI.length>0){
    YANWO_ZHISHI.forEach(function(item){
      html+='<div class="card"><h3>'+item.title+'</h3>';
      html+='<p>'+item.content.substring(0,100)+'...</p>';
      html+='<p style="color:#888;font-size:12px;">📅 '+item.date+'</p></div>';
    });
  }else{
    html+='<p class="empty">暂无燕窝知识</p>';
  }
  html+='</div>';
  return html;
}

// 资讯
function renderNews(){
  var html='<div class="section"><h2>📰 资讯</h2><div class="card-list">';
  FANGCHAN_POLICY.forEach(function(item){
    html+='<div class="card"><h3>'+item.title+'</h3><p>'+item.content.substring(0,100)+'...</p>';
    html+='<p>📅 '+item.date+' | 👁 '+item.views+'</p></div>';
  });
  html+='</div>';
  html+='<div class="user-post-btn"><button class="btn btn-primary" onclick="showPostForm(\'news\')">📝 个人发布</button></div>';
  return html;
}

// 管理后台
function renderAdmin(){
  if(localStorage.getItem('fangwu_admin')!=='1'){
    sm('adminLoginModal');
    return '<div class="section"><h2>管理后台</h2><p>请先登录管理账号</p></div>';
  }
  var users=getUsers();
  var posts=JSON.parse(localStorage.getItem(USER_POSTS_KEY)||'{}');
  var totalPosts=0;
  for(var k in posts)totalPosts+=posts[k].length;
  
  var html='<div class="admin-panel"><h2>🏢 管理后台</h2>';
  html+='<div class="stat-grid">';
  html+='<div class="stat-card"><h3>注册用户</h3><div class="num">'+Object.keys(users).length+'</div></div>';
  html+='<div class="stat-card"><h3>个人发布</h3><div class="num">'+totalPosts+'</div></div>';
  html+='<div class="stat-card"><h3>楼盘信息</h3><div class="num">'+LOU_PAN.length+'</div></div>';
  html+='</div>';
  
  html+='<h3>用户管理</h3><table class="admin-table"><thead><tr><th>用户名</th><th>手机</th><th>注册日期</th><th>操作</th></tr></thead><tbody>';
  for(var name in users){
    html+='<tr><td>'+name+'</td><td>'+users[name].phone+'</td><td>'+users[name].date+'</td>';
    html+='<td><button class="btn btn-sm" onclick="deleteUser(\''+name+'\')">删除</button></td></tr>';
  }
  html+='</tbody></table>';
  html+='<button class="btn btn-outline" onclick="adminLogout()" style="margin-top:20px">退出管理</button></div>';
  return html;
}

function deleteUser(name){
  if(!confirm('确定删除用户 '+name+'?'))return;
  var users=getUsers();
  delete users[name];
  saveUsers(users);
  gp('admin');
  toast('用户已删除','ok');
}

function adminLogin(){
  var u=document.getElementById('adminUser').value;
  var p=document.getElementById('adminPwd').value;
  if(u==='admin'&&p==='admin123'){
    localStorage.setItem('fangwu_admin','1');
    cm('adminLoginModal');
    gp('admin');
    toast('管理登录成功','ok');
  }else{toast('账号或密码错误','er');}
}

function adminLogout(){
  localStorage.removeItem('fangwu_admin');
  gp('home');
  toast('已退出管理','ok');
}

// ========== 页面导航 ==========
function gp(page){
  var grid=document.getElementById('mainGrid');
  if(!grid)return;
  
  // 更新导航高亮
  document.querySelectorAll('.lk').forEach(function(a){a.classList.remove('on');});
  var map={home:0,fangchan:1,tudi:2,shenghuo:3,diandongche:4,dianji:5,wangyueche:6,xueche:7,news:8,admin:9};
  var links=document.querySelectorAll('.lk');
  if(map[page]!==undefined&&links[map[page]])links[map[page]].classList.add('on');
  
  // 渲染页面
  var content='';
  switch(page){
    case 'home':content=renderHome();break;
    case 'fangchan':content=renderFangchan();break;
    case 'tudi':content=renderTudi();break;
    case 'shenghuo':content=renderShenghuo();break;
    case 'diandongche':content=renderDianji();break;
    case 'dianji':content=renderDianji();break;
    case 'wangyueche':content=renderWangyueche();break;
    case 'xueche':content=renderXueche();break;
    case 'news':content=renderNews();break;
    case 'admin':content=renderAdmin();break;
    default:content=renderHome();
  }
  grid.innerHTML=content;
  window.scrollTo({top:0,behavior:'smooth'});
}

// ========== 初始化 ==========
window.addEventListener('load',function(){
  gp('home');
});
