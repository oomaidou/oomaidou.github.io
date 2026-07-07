/**
 * 优惠券渲染器 - 从JSON数据动态生成优惠券内容
 * 兼容版本：支持微信浏览器和老版本浏览器
 */

function CouponRenderer(platforms) {
  // 平台/类目列表来自 platforms.json；未传入时回退到旧列表（独立页面兼容）
  this.platforms = platforms || ['meituan', 'eleme', 'jingdong', 'shuang11', 'shenghuo'];
}

/**
 * 根据 platforms.json 配置生成标签栏、金刚区和内容容器
 * @param {Array} platforms - [{id, name, icon}, ...]
 */
function buildCouponNav(platforms) {
  var tabsEl = document.getElementById('tabs');
  var gridEl = document.getElementById('category-grid');
  var mainEl = document.getElementById('main');
  var tabsHtml = '';
  var gridHtml = '';
  var mainHtml = '';

  for (var i = 0; i < platforms.length; i++) {
    var p = platforms[i];
    var active = i === 0 ? ' active' : '';
    tabsHtml += '<div class="tab-link' + active + '" data-platform="' + p.id + '" onclick="selectPlatform(\'' + p.id + '\')">' +
                '<span>' + p.name + '</span></div>';
    gridHtml += '<a class="category-item" href="javascript:void(0)" onclick="selectPlatform(\'' + p.id + '\')">' +
                '<img src="' + p.icon + '" alt="' + p.name + '优惠券">' +
                '<span>' + p.name + '</span></a>';
    mainHtml += '<div id="' + p.id + '" class="tab-content"' + (i === 0 ? ' style="display: block;"' : '') + '></div>';
  }

  if (tabsEl) tabsEl.innerHTML = tabsHtml;
  if (gridEl) gridEl.innerHTML = gridHtml;
  if (mainEl) mainEl.innerHTML = mainHtml;
}

/**
 * 渲染指定平台的优惠券内容
 * @param {string} platform - 平台名称
 */
CouponRenderer.prototype.renderPlatform = function(platform) {
  var self = this;
  try {
    // 检查是否在独立页面中，如果是则跳过
    if (window.couponRendererInitialized) {
      return;
    }
    
    // 使用polyfill后的fetch或XHR
    fetch(platform + '/coupons.json').then(function(response) {
      return response.json();
    }).then(function(data) {
      var container = document.getElementById(platform);
      if (!container) return;

      var html = '<div class="platform-block" id="' + platform + '-block">';

      // 渲染各个区域
      for (var i = 0; i < data.sections.length; i++) {
        var section = data.sections[i];
        html += '<div class="regular-section">';
        // 红包专区小号提示，仅美团、饿了么、京东
        if (section.title === '红包专区' && ['meituan', 'eleme', 'jingdong'].indexOf(platform) !== -1) {
          html += '<h2>' + section.title + '<span class="hint">（红包每天0点更新！）</span></h2>';
        } else {
          html += '<h2>' + section.title + '</h2>';
        }
        // 渲染该区域的所有优惠券
        for (var j = 0; j < section.coupons.length; j++) {
          html += self.renderCouponCard(section.coupons[j], data.icon);
        }
        html += '</div>';
      }
      
      html += '</div>';
      container.innerHTML = html;

    }).catch(function(error) {
      console.error('加载' + platform + '数据失败:', error);
      // 降级处理：显示错误信息
      var container = document.getElementById(platform);
      if (container) {
        container.innerHTML = '<div class="error-message">加载失败，请刷新重试</div>';
      }
    });
  } catch(error) {
    console.error('渲染平台数据时出错:', error);
  }
};

/**
 * 渲染单个优惠券卡片
 * @param {Object} coupon - 优惠券数据
 * @param {string} iconPath - 平台图标路径
 * @returns {string} HTML字符串
 */
CouponRenderer.prototype.renderCouponCard = function(coupon, iconPath) {
  // 优先使用coupon.icon，没有则用平台iconPath
  var icon = coupon.icon ? coupon.icon : iconPath;
  var html = '<div class="card">';
  html += '<div class="card-icon"><img src="' + icon + '" alt="平台图标"></div>';
  html += '<div class="card-content">';
  html += '<h2>' + coupon.title + '</h2>';
  html += '<p>' + coupon.description + '</p>';
  
  // 如果是复制类型的优惠券，添加隐藏的内容
  if (coupon.type === 'copy') {
    var dataType = coupon.dataType ? (' data-type="' + coupon.dataType + '"') : '';
    html += '<span id="' + coupon.id + '" style="display:none"' + dataType + '>' + coupon.content + '</span>';
  }
  
  html += '</div>';
  
  // 根据类型渲染不同的按钮
  if (coupon.type === 'link') {
    html += '<a href="' + coupon.url + '" target="_blank" class="button">' + coupon.action + '</a>';
  } else if (coupon.type === 'copy') {
    html += '<button class="button" data-copy-id="' + coupon.id + '">' + coupon.action + '</button>';
  }
  
  html += '</div>';
  return html;
};

/**
 * 渲染今日主推内容
 * @param {string} jsonPath - JSON文件路径
 * @param {string} topDivId - 容器ID
 */
CouponRenderer.prototype.renderTop = function(jsonPath, topDivId) {
  try {
    // 检查是否在独立页面中，如果是则跳过
    if (window.couponRendererInitialized) {
      return;
    }
    
    fetch(jsonPath).then(function(response) {
      return response.json();
    }).then(function(data) {
      var topDiv = document.getElementById(topDivId);
      if (!topDiv) return;
      
      // 如果没有主推内容，直接隐藏区域
      if (!data.items || data.items.length === 0) {
        topDiv.innerHTML = '';
        return;
      }
      
      var now = new Date();
      var dateStr = (now.getMonth() + 1) + '月' + now.getDate() + '日';
      var html = '<div class="highlight-section">';
      html += '<h2>🔥 今日主推 (' + dateStr + '更新)</h2>';
      html += '<ul class="deals-list">';
      for (var i = 0; i < data.items.length; i++) {
        html += '<li>' + data.items[i] + '</li>';
      }
      html += '</ul>';
      html += '</div>';
      topDiv.innerHTML = html;
    }).catch(function(error) {
      console.error('加载今日主推数据失败:', error);
    });
  } catch(error) {
    console.error('渲染今日主推时出错:', error);
  }
};

/**
 * 初始化所有平台
 */
CouponRenderer.prototype.init = function() {
  var self = this;
  var platformIndex = 0;
  
  function renderNext() {
    if (platformIndex < self.platforms.length) {
      self.renderPlatform(self.platforms[platformIndex]);
      platformIndex++;
      // 添加延时，避免并发请求问题
      setTimeout(renderNext, 100);
    }
  }
  
  renderNext();
};

// 页面加载完成后初始化（仅在主页时）
function initCouponPage() {
  // 主页有 #tabs 容器：从 platforms.json 构建导航后渲染
  if (document.getElementById('tabs')) {
    fetch('platforms.json').then(function(response) {
      return response.json();
    }).then(function(config) {
      buildCouponNav(config.platforms);
      var ids = [];
      for (var i = 0; i < config.platforms.length; i++) {
        ids.push(config.platforms[i].id);
      }
      new CouponRenderer(ids).init();
    }).catch(function(error) {
      console.error('加载平台配置失败:', error);
      var mainEl = document.getElementById('main');
      if (mainEl) {
        mainEl.innerHTML = '<div class="error-message">加载失败，请刷新重试</div>';
      }
    });
  } else {
    // 无 #tabs 的旧页面：按旧逻辑渲染
    new CouponRenderer().init();
  }
}

if (!window.couponRendererInitialized) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCouponPage);
  } else {
    // DOM已经加载完成
    initCouponPage();
  }
}