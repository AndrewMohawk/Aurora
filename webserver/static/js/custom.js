$(window).on('load',function(){
    $('.menu').css('display','block');
    $('#preloader').addClass('preloader-hide');
})
 
$(document).ready(function(){      
    'use strict'	
    
    /*Global Settings*/
    var isAJAX = false; //Enables or disable AJAX page transitions and loading.
    var isDevMode = false; // Enables development mode. Clean cache & Stops BG & Highlights from changing defaults and adds reload button for PWA refresh
    
    /*PWA Settings*/
    var pwaEnabled = true; // activate the PWA and all settings below
    var pwaNoCache = true; // always keep the cache clear to serve the freshest possible content
    var pwaRemind = 1; // how many days after the user rejects / clicks maybe later to re-show the install pwa window. set 0 to always.
    
    /*Menu Extender Global Function*/
    $.fn.showMenu = function() {$(this).addClass('menu-active'); $('#footer-bar').addClass('footer-menu-hidden');setTimeout(function(){$('.menu-hider').addClass('menu-active');},250);}; 
    $.fn.hideMenu = function() {$(this).removeClass('menu-active'); $('#footer-bar').removeClass('footer-menu-hidden');$('.menu-hider').removeClass('menu-active');}; 

    //ADD YOUR CUSTOM JAVASCRIPT CODES HERE! 
    //Do not put inside HTML files.
    //The init_template() function will be triggered when pages open.
  
  


	function init_template(){        
        
        $("#hdmi_hue, #hdmi_saturation,#hdmi_brightness,#hdmi_contrast,#hdmi_gamma").slider({
            tooltip: 'always'
        });
        
        
        //Disable Page Jump on Empty Links.
        $('a').on('click', function(){var attrs = $(this).attr('href'); if(attrs === '#'){return false;}});
        
        //Adding Background for Gradient
        if(!$('.menu-hider').length){$('#page').append('<div class="menu-hider"><div>');}
                
        var menu = $('.menu'),
            body = $('body'),
            menuFixed = $('.nav-fixed'),
            menuFooter = $('#footer-bar'),
            menuClose = $('.close-menu'),
            header = $('.header'),
            pageAll = $('#page'),
            pageContent = $('.page-content'),
            headerAndContent = $('.header, .page-content, #footer-bar');

        
        //Menu Required Variables
        function menuFunctions(){
            //Adding Menu Hider
            if(!$('.menu-hider').length){$('#page').append('<div class="menu-hider"><div>');}
            //Defining Function Variables
            var menuHider = $('.menu-hider');
            var menuDeployer = $('[data-menu]');
            
            //Appling settings to each menu based on user preferences.
            menu.each(function(){
                var menuHeight = $(this).data('menu-height');
                var menuWidth = $(this).data('menu-width');
                var menuActive = $(this).data('menu-active');
                if($(this).hasClass('menu-box-right')){$(this).css("width",menuWidth);}    
                if($(this).hasClass('menu-box-left')){$(this).css("width",menuWidth);}      
                if($(this).hasClass('menu-box-bottom')){$(this).css("height",menuHeight);}  
                if($(this).hasClass('menu-box-top')){$(this).css("height",menuHeight);}           
                if($(this).hasClass('menu-box-modal')){$(this).css({"height":menuHeight, "width":menuWidth});}
            });    
            
            $('.menu a').on('click',function(){$('body').removeClass('modal-open');})

            //Menu Deploy Click
            menuDeployer.on('click',function(){     
                menu.removeClass('menu-active');
                menuHider.addClass('menu-active');
                var menuData = $(this).data('menu');
                var menuID = $('#'+menuData);
                var menuEffect = $('#'+menuData).data('menu-effect');
                var menuWidth = menuID.data('menu-width');
                var menuHeight = menuID.data('menu-height');
                $('body').addClass('modal-open');
                if(menuID.hasClass('menu-header-clear')){menuHider.addClass('menu-active-clear');}  
                function menuActivate(){menuID = 'menu-active' ? menuID.addClass('menu-active') : menuID.removeClass('menu-active');}               
                if(menuID.hasClass('menu-box-bottom')){$('#footer-bar').addClass('footer-menu-hidden');}
                if(menuEffect === "menu-parallax"){
                    if(menuID.hasClass('menu-box-bottom')){headerAndContent.css("transform", "translateY("+(menuHeight/5)*(-1)+"px)");}    
                    if(menuID.hasClass('menu-box-top')){headerAndContent.css("transform", "translateY("+(menuHeight/5)+"px)");}       
                    if(menuID.hasClass('menu-box-left')){headerAndContent.css("transform", "translateX("+(menuWidth/5)+"px)");}       
                    if(menuID.hasClass('menu-box-right')){headerAndContent.css("transform", "translateX("+(menuWidth/5)*(-1)+"px)");}
                }    
                if(menuEffect === "menu-push"){
                    if(menuID.hasClass('menu-box-bottom')){headerAndContent.css("transform", "translateY("+(menuHeight)*(-1)+"px)");}    
                    if(menuID.hasClass('menu-box-top')){headerAndContent.css("transform", "translateY("+(menuHeight)+"px)");}       
                    if(menuID.hasClass('menu-box-left')){headerAndContent.css("transform", "translateX("+(menuWidth)+"px)");}       
                    if(menuID.hasClass('menu-box-right')){headerAndContent.css("transform", "translateX("+(menuWidth)*(-1)+"px)");}
                }       
                if(menuEffect === "menu-push-full"){
                    if(menuID.hasClass('menu-box-left')){headerAndContent.css("transform", "translateX(100%)");}       
                    if(menuID.hasClass('menu-box-right')){headerAndContent.css("transform", "translateX(-100%)");}
                }
                
                if(menuID.data('menu-hide')){
                    $(this).addClass('no-click')
                    $('.menu-hider').addClass('no-click')
                    var menuHideTime = menuID.data('menu-hide');
                    $(this).addClass('menu-active');
                    menuHider.addClass('menu-active');
                    setTimeout(function(){
                        menuDeployer.removeClass('no-click')
                        menu.removeClass('menu-active');
                        menuHider.removeClass('menu-active menu-active-clear no-click');
                        headerAndContent.css('transform','translate(0,0)');
                        menuHider.css('transform','translate(0,0)');
                        $('#footer-bar').removeClass('footer-menu-hidden');
                        $('body').removeClass('modal-open');
                    },menuHideTime)
                }
                
                menuActivate();
                return false;
            });

            var autoActivateMenu = $('[data-auto-activate]');
            if (autoActivateMenu.length){
                var autoActivateTimeout = (autoActivateMenu.data('auto-activate'))*1000
                console.log(autoActivateTimeout)
                if(autoActivateTimeout){
                    setTimeout(function(){
                        autoActivateMenu.addClass('menu-active');
                        menuHider.addClass('menu-active');
                    },autoActivateTimeout);
                } else {
                    autoActivateMenu.addClass('menu-active');
                    menuHider.addClass('menu-active');
                }
            }

            //Allows clicking even if menu is loaded externally.
            $('.menu-hider, .close-menu, .menu-close').on('click', function(){
                menu.removeClass('menu-active');
                menuHider.removeClass('menu-active menu-active-clear');
                headerAndContent.css('transform','translate(0,0)');
                menuHider.css('transform','translate(0,0)');
                $('#footer-bar').removeClass('footer-menu-hidden');
                $('body').removeClass('modal-open');
                return false;
            });

            //Setting Active Menu
            if($('#menu-main').length){
                var menuActive = $('#menu-main').data('menu-active');
                $('#'+menuActive).addClass('menu-active');
            }
            
            //Detecting and Selecting Active Submenu.
            setTimeout(function(){
                var menuActive = $('#menu-main').data('menu-active');
                $('#'+menuActive).addClass('nav-item-active');
                $('[data-submenu]').on('click',function(){
                    $(this).toggleClass('nav-item-active');
                    $(this).find('.fa-chevron-right').toggleClass('rotate-90');
                   var subID = $(this).data('submenu');
                    $('#'+subID).slideToggle(250);
                    return false;
                });
                $('[data-submenu]').each(function(){
                    var subID = $(this).data('submenu');
                    var subChildren = $('#'+subID).children().length;
                    $(this).find('strong').html(subChildren);
                });
                if($('.nav-item-active').data('submenu')){
                    $('.nav-item-active').find('.fa-chevron-right').toggleClass('rotate-90');
                    var subID = $('.nav-item-active').data('submenu');
                    $('#'+subID).slideDown(250);
                } 
                if($('.nav-item-active').parent().hasClass('submenu')){
                    $('.nav-item-active').parent().slideDown(250);
                }
            },250);
        }

        //Disabling & Enabling Dark Transitions in Dark Mode to Speed up Performance.
        function allowTransitions(){$('body').find('#transitions-remove').remove();}
        function removeTransitions(){$('body').append('<style id="transitions-remove">.btn, .header, #footer-bar, .menu-box, .menu-active{transition:all 0ms ease!important;}</style>');}

        //Dark Mode
        function darkMode(){            
            var darkSwitch = $('[data-toggle-theme-switch], [data-toggle-theme], [data-toggle-theme-switch] input, [data-toggle-theme] input');
            $('[data-toggle-theme], [data-toggle-theme-switch]').off().on('click',function(){
                removeTransitions();
                $('body').toggleClass('theme-light theme-dark');
                    if($('body').hasClass('detect-theme')){$('body').removeClass('detect-theme');}
                    if($('body').hasClass('theme-light')){
                        darkSwitch.prop('checked', false); 
                        localStorage.setItem('Appkit-Theme','light-mode')
                    }
                    if($('body').hasClass('theme-dark')){
                        darkSwitch.prop('checked', true); 
                        localStorage.setItem('Appkit-Theme','dark-mode')
                    }
                setTimeout(function(){allowTransitions();},150);
                return false;
            })
            if (localStorage.getItem('Appkit-Theme') == "dark-mode") {darkSwitch.prop('checked', true); $('body').removeClass('theme-light').addClass('theme-dark');}
            if (localStorage.getItem('Appkit-Theme') == "light-mode") {darkSwitch.prop('checked', false); $('body').removeClass('theme-dark').addClass('theme-light');}

            //Auto Dark Mode
            function activateDarkMode(){
                $('body').removeClass('theme-light').addClass('theme-dark'); 
                $('#dark-mode-detected').removeClass('disabled'); 
                localStorage.setItem('Appkit-Theme','dark-mode')
            }
            function activateLightMode(){
                $('body').removeClass('theme-dark').addClass('theme-light'); 
                $('#dark-mode-detected').removeClass('disabled'); 
                localStorage.setItem('Appkit-Theme','light-mode')
            }
            function activateNoPreference(){$('#manual-mode-detected').removeClass('disabled');}        

            function setColorScheme() {
                const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
                const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches
                const isNoPreference = window.matchMedia("(prefers-color-scheme: no-preference)").matches
                window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && activateDarkMode())
                window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && activateLightMode())
                window.matchMedia("(prefers-color-scheme: no-preference)").addListener(e => e.matches && activateNoPreference())
                if(isDarkMode) activateDarkMode();
                if(isLightMode) activateLightMode();
            }
            
            if($('body').hasClass('detect-theme')){setColorScheme();}
            $('.detect-dark-mode').on('click',function(){ $('body').addClass('detect-theme'); setColorScheme(); return false;});
            $('.disable-auto-dark-mode').on('click',function(){ $('body').removeClass('detect-theme'); $(this).remove(); return false;});
        }
        darkMode();
        
        //Footer Menu Active Elements
        if($('.footer-bar-2, .footer-bar-4, .footer-bar-5, .footer-bar-6').length){
            if(!$('.footer-bar-1 strong, .footer-bar-2 strong, .footer-bar-4 strong, .footer-bar-5 strong, .footer-bar-6 strong').length){
                $('.footer-bar-1 .active-nav, .footer-bar-2 .active-nav, .footer-bar-4 .active-nav, .footer-bar-5 .active-nav, .footer-bar-6 .circle-nav').append('<strong><u></u></strong>')
                $('.footer-bar-6 .active-nav').append('<em></em>')
            }
        }
        
        
        //Adding Local Storage for Visited Links
        localStorage.setItem('z_AppKit-Visited:' + window.location.pathname, 'Page Visited');
        $.fn.visited = function (className) {
            className = className || false;
            $(this).each(function (index, element) {
                if (element.host == window.location.host &&
                    localStorage.getItem('z_AppKit-Visited:' + element.pathname) ||
                    localStorage.getItem('z_AppKit-Visited:' + element.pathname + '/')) {
                    if (className) {
                        $(element).addClass(className);
                        $(element).find('.badge').addClass('disabled');
                    } else {
                        $(element).attr('data-visited', true);
                    }
                }
            });
        };
        
        //Scroll to Old Position in Lists
        $('.list-group a').on('click',function(){if($(this).attr('href') != '#'){localStorage.setItem('z_Appkit-Visited-Scroll-Position', $(window).scrollTop());}})
        if($('.check-visited').length){
            setTimeout(function(){
                var getScroll = localStorage.getItem('z_Appkit-Visited-Scroll-Position');
                $(window).scrollTop(getScroll)
                 localStorage.removeItem('z_Appkit-Visited-Scroll-Position');
            },200);
        }

        //Visited Link
        function visited_check(){$('.check-visited a').visited('visited-link');}
        visited_check();
        
        //Back Button in Header
        var backButton = $('.back-button, [data-back-button]');
        backButton.on('click', function() {
            window.history.go(-1);
        });
        
		//Copyright Year 
        var copyrightYear = $('.copyright-year, #copyright-year');
        var dteNow = new Date(); var intYear = dteNow.getFullYear();
        copyrightYear.html(intYear);
        
        //Back to top Badge
        var backToTopBadge = $('.back-to-top-badge, .back-to-top-icon');

        function backToTop(){
            $('.back-to-top, [data-back-to-top], .back-to-top-badge, .back-to-top-icon').on( "click", function(e){
                e.preventDefault();
                $('html, body, .page-content').animate({
                    scrollTop: 0
                }, 350);
                return false;
            });
        }
        backToTop();
        
        function show_back_to_top_badge(){backToTopBadge.addClass('back-to-top-visible');}
        function hide_back_to_top_badge(){backToTopBadge.removeClass('back-to-top-visible');}

        //Detect Ad Blocker
        if($("#adblock-detect img").css('display') == "none") {
            $('#adblock-message').removeClass('disabled');
        } else {
            $('#adblock-message, #adblock-detect').addClass('disabled');
        }

        
        //Activate Ads Demo
        
        $('.activate-scroll-ad').on('click', function(){$('#scroll-ad').removeClass('disabled'); $('#fixed-ad').addClass('disabled')})
        $('.activate-fixed-ad').on('click', function(){$('#scroll-ad').addClass('disabled'); $('#fixed-ad').removeClass('disabled')})
        
        //Scroll Ads
        var scrollAd = $('.scroll-ad');
        function show_scroll_ad(){scrollAd.addClass('scroll-ad-visible');}
        function hide_scroll_ad(){scrollAd.removeClass('scroll-ad-visible');}

        //Scroll Over Page Top
        setTimeout(function(){
            var pageContentTopHeight = $('.page-content-top').height();
            $('.page-content-top-clear').css('height', pageContentTopHeight);
        },25);

        
        $(window).on('scroll', function () {
            var pageContentTop = $('.page-title');
            var total_scroll_height = document.body.scrollHeight
            var pageContentTopHeightScroll = pageContentTop.height()    

            var outside_top = ($(this).scrollTop() > pageContentTopHeightScroll);
            var inside_top = ($(this).scrollTop() <= pageContentTopHeightScroll);
            var inside_header = ($(this).scrollTop() <= 150);
            var passed_header = ($(this).scrollTop() >= 0); //250  
            var footer_reached = ($(this).scrollTop() >= (total_scroll_height - ($(window).height() + 300 )));

            
            if(outside_top == true){
                $('.header-auto-show').addClass('header-active');
                pageContentTop.css('opacity','0')
            }     
            if(inside_top == true){
                $('.header-auto-show').removeClass('header-active');
                pageContentTop.css('opacity','1')
            }
            if (inside_header === true) {
                hide_back_to_top_badge();
                hide_scroll_ad();
                if(!pageContentTop.length){
                    $('.header-auto-show').removeClass('header-active');
                }
            }
            else if(passed_header === true){
                show_back_to_top_badge();
                show_scroll_ad();
                if(!pageContentTop.length){
                    $('.header-auto-show').addClass('header-active');
                }
            } 
            if (footer_reached == true){
                hide_back_to_top_badge();
                hide_scroll_ad();
            }
        });
        
        
        //Visit Detection
        var visitDetection = $('.visit-detection');
        if(visitDetection.length){
            var lastVisitValue = localStorage.getItem('Appkit-Last-Visited');
            var d = new Date();
            var strDate = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate();
            var strTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            if(!lastVisitValue){
                $('.never-visited').show();
                $('.before-visited').hide();
                localStorage.setItem('Appkit-Last-Visited', '<br>Your last visit was ' + strDate +' at '+ strTime)
            } else {
                $('.visit-before-time').html(lastVisitValue);
                $('.never-visited').hide();
                $('.before-visited').show();
                localStorage.setItem('Appkit-Last-Visited', '<br>Your last visit was ' + strDate +' at '+ strTime)
            }
        }        


        //Tabs//
        var tab = $('.tab-controls');
        function activate_tabs(){
            var tabTrigger = $('.tab-controls a');
            tab.each(function(){
                var tabItems = $(this).parent().find('.tab-controls').data('tab-items');
                var tabWidth = $(this).width();
                var tabActive = $(this).find('a[data-tab-active]');
                var tabID = $('#'+tabActive.data('tab'));
                var tabBg = $(this).data('tab-active');
                $(this).find('a[data-tab]').css("width", (100/tabItems)+'%');
                tabActive.addClass(tabBg);
                tabActive.addClass(tabBg);
                tabID.slideDown(0);
            });
            tabTrigger.on('click',function(){
                var tabData = $(this).data('tab');
                var tabID = $('#'+tabData);
                var tabContent = $(this).parent().parent().find('.tab-content');
                var tabContent = $(this).parent().parent().parent().find('.tab-content');
                var tabOrder = $(this).data('tab-order');
                var tabBg = $(this).parent().parent().find('.tab-controls').data('tab-active');
                $(this).parent().find(tabTrigger).removeClass(tabBg);
                $(this).addClass(tabBg);
                $(this).parent().find('a').removeClass('no-click');
                $(this).addClass('no-click');
                tabContent.slideUp(250);
                tabID.slideDown(250);
            });
        }
        if(tab.length){activate_tabs()}

        //Text Resizer
       $(".text-size-increase").click(function() {$(".text-size-changer *").css("font-size","+=1");}); 
       $(".text-size-decrease").click(function() {$(".text-size-changer *").css("font-size","-=1");});
       $(".text-size-default").click(function() {$(".text-size-changer *").css("font-size", "");});
        
        //Search Menu Functions
        function search_menu(){
            $('[data-search]').on('keyup', function() {
                var searchVal = $(this).val();
                if (searchVal != '') {
                    $('.search-results').removeClass('disabled');
                    $('[data-filter-item]').addClass('disabled');
                    $('[data-filter-item][data-filter-name*="' + searchVal.toLowerCase() + '"]').removeClass('disabled');
                } 
                if (searchVal == '') {
                    console.log('test')
                    setTimeout(function(){$('.search-results').addClass('disabled');},10);
                    $('[data-filter-item]').removeClass('disabled');
                }

                var searchTotalItems = $('.search-results [data-filter-item]').length;                
                var search_results_error = $('.search-no-results');
                var search_results_active = $('.search-results').find('[data-filter-item].disabled');
                if (search_results_active.length == searchTotalItems) {
                    $('.search-no-results').removeClass('disabled');
                    $('.search-results').addClass('disabled');
                }else{
                    $('.search-no-results').addClass('disabled');
                    $('.search-results').removeClass('disabled');
                }            
            });
            return false;
        }
        search_menu();

        //Owl Carousel Sliders
        setTimeout(function(){
            $('.user-slider').owlCarousel({loop:false, margin:20, nav:false, lazyLoad:true, items:1, autoplay: false, dots:false, autoplayTimeout:4000});		
            $('.news-slider').owlCarousel({loop:true, margin:20, nav:false, stagePadding:30, lazyLoad:true, items:5, autoplay: false, dots:false, autoplayTimeout:4000});		
            $('.topic-slider').owlCarousel({loop:true, margin:0, nav:false, stagePadding:40, lazyLoad:true, items:2, autoWidth:true, autoplay: false, dots:false, autoplayTimeout:4000});		
            $('.story-slider').owlCarousel({loop:true, margin:20, nav:false, stagePadding:30, lazyLoad:true, items:4, autoplay: false, dots:false, autoplayTimeout:4000});		
            $('.single-slider').owlCarousel({loop:true, margin:20, nav:false, lazyLoad:true, items:1, autoplay: true, autoplayTimeout:4000});		
            $('.fast-slider').owlCarousel({loop:true, margin:20, nav:false, lazyLoad:true, items:1, autoplay: true, autoplayTimeout:2000});		
            $('.boxed-slider').owlCarousel({loop:true, margin:20, stagePadding:50, nav:false, lazyLoad:true, items:1, autoplay: false, autoplayTimeout:4000});		
            $('.card-slider').owlCarousel({loop:true, margin:20, nav:false, lazyLoad:true, stagePadding:50, items:1, autoplay: true, autoplayTimeout:4000});		
            $('.cover-slider').owlCarousel({loop:false, margin:0, nav:false, lazyLoad:true, items:1, autoplay: true, autoplayTimeout:6000});		
            $('.double-slider').owlCarousel({loop: true, stagePadding:20, margin: 23, nav: false, items: 2,  dots: false});		
            $('.task-slider').owlCarousel({loop:true, margin:20, nav:false, stagePadding:50, lazyLoad:true, items:2, autoplay: false, autoplayTimeout:4000});		
            $('.next-slide, .next-slide-arrow, .next-slide-text, .cover-next').on('click',function(){$(this).parent().find('.owl-carousel').trigger('next.owl.carousel');});		
            $('.prev-slide, .prev-slide-arrow, .prev-slide-text, .cover-prev').on('click',function(){$(this).parent().find('.owl-carousel').trigger('prev.owl.carousel');});		
            $('.next-slide-user').on('click',function(){$(this).closest('.owl-carousel').trigger('next.owl.carousel');});		
            $('.prev-slide-user').on('click',function(){$(this).closest('.owl-carousel').trigger('prev.owl.carousel');});		
        },10);
        setTimeout(function(){
            $('.owl-prev, .owl-next').addClass('bg-highlight');
        })

        //Detect Mobile OS//
        var isMobile = {
            Android: function() {return navigator.userAgent.match(/Android/i);},
            iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
            Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
            any: function() {return (isMobile.Android() || isMobile.iOS() || isMobile.Windows());}
        };
        if (!isMobile.any()) {
            $('body').addClass('is-not-ios');
            $('.show-ios, .show-android').addClass('disabled');
            $('.show-no-device').removeClass('disabled');
        }
        if (isMobile.Android()) {
            $('body').addClass('is-not-ios');
            $('head').append('<meta name="theme-color" content="#FFFFFF"> />');
            $('.show-android').removeClass('disabled');
            $('.show-ios, .show-no-device, .simulate-android, .simulate-iphones').addClass('disabled');
        }
        if (isMobile.iOS()) {
            $('body').addClass('is-ios');
            $('.show-ios').removeClass('disabled');
            $('.show-android, .show-no-device, .simulate-android, .simulate-iphones').addClass('disabled');
        }


        //Toast, Snackbars and Notifications
        $('[data-toast]').on('click',function(){
            $('.toast, .snackbar-toast, .notification').toast('hide'); 
            $('#'+$(this).data('toast')).toast('show'); 
            return false;
        });
        $('[data-dismiss]').on('click',function(){
            var thisData = $(this).data('dismiss');
            $('#'+thisData).toast('hide');
        });
        
        //Tooltips
        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        })
        
        //Cancel Collapse Jump on Click
        if($('[data-toggle="collapse"]').length){
            $('[data-toggle="collapse"]').on('click',function(e){
                e.preventDefault();
            });
        }

        

        //Switches
        $('.ios-input, .android-input, .classic-input').on('click',function(){
            var id = $(this).attr('id');
            var data = $('[data-switch='+id+']')
            if(data.length){data.stop().animate({height: 'toggle'},250);}
        });
        $('[data-activate]').on('click',function(){
            var activateCheck = $(this).data('activate');
            $('#'+activateCheck).trigger('click');
        });

        $('[data-trigger-switch]').on('click',function(){
            var thisID = $(this).data('trigger-switch');
            if ($('#'+thisID).prop('checked')) {
                $('#'+thisID).prop('checked', false);
            } else {
                $('#'+thisID).prop('checked', true);
            }        
        })

        //Working Hours 
        var businessHours =  $('.business-hours');
            function activate_business_hours(){
            if(businessHours.length){
                var getTime = new Date(Date.now());
                var getDay = 'day-' + (new Date().toLocaleDateString('en', {weekday:'long'})).toLowerCase();
                var timeNow = getTime.getHours() + ":" + getTime.getMinutes();
                var currentWorkDay =  $('.'+getDay);
                var closedMessage = businessHours.data('closed-message').toString();
                var closedMessageUnder = businessHours.data('closed-message-under').toString();
                var openedMessage = businessHours.data('opened-message').toString();
                var openedMessageUnder = businessHours.data('opened-message-under').toString();

                var mondayOpen = $('[data-monday]').data('open');
                var mondayClose = $('[data-monday]').data('close');
                var mondayTime = "'Monday' : ['"+mondayOpen+"','"+mondayClose+"'],"


                $('.business-hours').openingTimes({
                    //SET OPENING HOURS BELOW
                    openingTimes: {
                        'Monday'    : ['08:00' ,'17:00' ],
                        'Tuesday'   : ['08:00' ,'17:30' ],
                        'Wednesday' : ['08:00' ,'17:00' ],
                        'Thursday'  : ['08:00' ,'17:00' ],
                        'Friday'    : ['09:00' ,'18:55' ],
                        'Saturday'  : ['09:00' ,'12:00' ]
                        //Sunday removed, that means it's closed.
                    },
                    openClass:"bg-green-dark is-business-opened",
                    closedClass:"bg-red-dark is-business-closed"
                });    
                if(businessHours.hasClass('is-business-opened')){
                    $('.show-business-opened').removeClass('disabled');
                    $('.show-business-closed').addClass('disabled');
                    businessHours.find('h1').html(openedMessage);
                    businessHours.find('p').html(openedMessageUnder);
                    businessHours.find('#business-hours-mail').remove();
                    currentWorkDay.addClass('bg-green-dark');
                } else {
                    $('.show-business-opened').addClass('disabled');
                    $('.show-business-closed').removeClass('disabled');
                    businessHours.find('h1').html(closedMessage);
                    businessHours.find('p').html(closedMessageUnder);
                    businessHours.find('#business-hours-call').remove();
                    currentWorkDay.addClass('bg-red-dark');
                }

                currentWorkDay.find('p').addClass('color-white');
            };
        }
        if(businessHours.length){activate_business_hours()}

        //Adding added-to-homescreen class to be targeted when used as PWA.
        function ath(){
            (function(a, b, c) {
                if (c in b && b[c]) {
                    var d, e = a.location,
                        f = /^(a|html)$/i;
                    a.addEventListener("click", function(a) {
                        d = a.target;
                        while (!f.test(d.nodeName)) d = d.parentNode;
                        "href" in d && (d.href.indexOf("http") || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href)
                    }, !1);
                    $('.add-to-home').addClass('disabled');
                    $('body').addClass('is-on-homescreen');
                }
            })(document, window.navigator, "standalone")
        }
        ath();
        
        //Add to Home Banners
        $('.simulate-android-badge').on('click',function(){$('.add-to-home').removeClass('add-to-home-ios').addClass('add-to-home-visible add-to-home-android');});
        $('.simulate-iphone-badge').on('click',function(){$('.add-to-home').removeClass('add-to-home-android').addClass('add-to-home-visible add-to-home-ios');});
        $('.add-to-home').on('click',function(){$('.add-to-home').removeClass('add-to-home-visible');})
        $('.simulate-android-banner').on('click',function(){$('#menu-install-pwa-android, .menu-hider').addClass('menu-active')})
        $('.simulate-ios-banner').on('click',function(){$('#menu-install-pwa-ios, .menu-hider').addClass('menu-active')})
        
        
        //Extending Card Features
        function card_extender(){       
            /*Set Page Content to Min 100vh*/
            if($('.is-on-homescreen').length){
                var pageTitle = $('.page-title').height;
                var windowHeight = screen.height;
                $('.page-content, #page').css('min-height', windowHeight - pageTitle);
            } 
            if(!$('.is-on-homescreen').length){
                var pageTitle = $('.page-title').height;
                 var windowHeight = window.innerHeight
                $('.page-content, #page').css('min-height', windowHeight - pageTitle);
            } 
            
            $('.card-full').css('min-height', windowHeight);

            $('[data-card-height]').each(function(){
                var cardHeight = $(this).data('card-height');
                $(this).css('height', cardHeight);
                if(cardHeight == "cover"){
                    if(header.length && menuFooter.length){
                       $(this).css('height', windowHeight) 
                       $('.map-full, .map-full iframe').css('height', windowHeight) 
                    } else {
                       $(this).css('height', windowHeight)
                       $('.map-full, .map-full iframe').css('height', windowHeight)
                    }
                }
                if(cardHeight == "cover-card"){
                   $(this).css('height', windowHeight  - 200) 
                   $('.map-full, .map-full iframe').css('height', windowHeight - 200) 
                }
                if(cardHeight == "story-card"){
                   $(this).css('height', windowHeight-80) 
                }
            });
        }
        card_extender();

        $(window).resize(function(){
            card_extender();
        });
        
        //Color Changer
        function highlightLoader(){
            $('[data-highlight-style]').on('click',function(){
                $('.highlight-changer a').removeClass('menu-active');
                $(this).addClass('menu-active');
                var getHighlight = $(this).data('highlight-style');
                localStorage.setItem('AppKit-Highlight', getHighlight);
                $('#highlight').remove();
                $('head').append( $('<link rel="stylesheet" id="highlight" type="text/css" />').attr('href', getHighlight) );
                return false;
            });
            var rememberHighlight = localStorage.getItem('AppKit-Highlight');
            if (rememberHighlight != null){$('.highlight-changer a').removeClass('menu-active');}
            $('a[data-highlight-style="'+rememberHighlight+'"]').addClass('menu-active');
            $('head').append( $('<link rel="stylesheet" id="highlight" type="text/css" />').attr('href', rememberHighlight) );
        }
        highlightLoader();
        
        //Show Map
        $('.show-map, .hide-map').on('click',function(){
            $('.map-full .caption').toggleClass('deactivate-map');
            $('.map-but-1, .map-but-2').toggleClass('deactivate-map');
            $('.map-full .hide-map').toggleClass('activate-map');
        });    


        //Card Hovers
        $('.card-scale').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('img').toggleClass('card-scale-image');});  
        $('.card-grayscale').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('img').toggleClass('card-grayscale-image');});         
        $('.card-rotate').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('img').toggleClass('card-rotate-image');});       
        $('.card-blur').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('img').toggleClass('card-blur-image');});      
        $('.card-hide').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('.card-center, .card-bottom, .card-top, .card-overlay').toggleClass('card-hide-image');});


        //Reading Time
        $('#reading-progress-text').each(function(i) {
            var readingWords = $(this).text().split(' ').length;
            var readingMinutes = Math.floor(readingWords / 250);
            var readingSeconds = readingWords % 60
            $('.reading-progress-words').append(readingWords);
            $('.reading-progress-time').append(readingMinutes + ':' + readingSeconds);
        });      

        //Timed Ads
        var menuHider = $('.menuHider');
        if($('[data-auto-show-ad]').length){
            var time = $('[data-auto-show-ad]').data('auto-show-ad');
            setTimeout(function(){
                $('[data-auto-show-ad]').trigger('click');
            },time*1000);
        }
        $('[data-timed-ad]').on('click', function(){            
            var counter = $(this).data('timed-ad');
            var adwin = $('#'+$(this).data('menu'));
            menuHider.addClass('no-click');
            adwin.find('.ad-time-close').addClass('no-click');
            adwin.find('.ad-time-close i').addClass('disabled');
            adwin.find('.ad-time-close span').removeClass('disabled');

            var interval = setInterval(function() {
                counter--;
                // Display 'counter' wherever you want to display it.
                if (counter <= 0) {
                    menuHider.removeClass('no-click');
                    adwin.find('.ad-time-close').removeClass('no-click');
                    adwin.find('.ad-time-close i').removeClass('disabled');
                    adwin.find('.ad-time-close span').addClass('disabled');
                    clearInterval(interval);
                    return;
                }else{
                    adwin.find('.ad-time-close span').html(counter);
                }
            }, 1000);
        });

        //Countdown
        function countdown(dateEnd) {
            var timer, years, days, hours, minutes, seconds;
            dateEnd = new Date(dateEnd);
            dateEnd = dateEnd.getTime();
            if (isNaN(dateEnd)) {return;}
            timer = setInterval(calculate, 1);
            function calculate() {
                var dateStart = new Date();
                var dateStart = new Date(dateStart.getUTCFullYear(), dateStart.getUTCMonth(), dateStart.getUTCDate(), dateStart.getUTCHours(), dateStart.getUTCMinutes(), dateStart.getUTCSeconds());
                var timeRemaining = parseInt((dateEnd - dateStart.getTime()) / 1000)
                if (timeRemaining >= 0) {
                    years = parseInt(timeRemaining / 31536000);
                    timeRemaining = (timeRemaining % 31536000);
                    days = parseInt(timeRemaining / 86400);
                    timeRemaining = (timeRemaining % 86400);
                    hours = parseInt(timeRemaining / 3600);
                    timeRemaining = (timeRemaining % 3600);
                    minutes = parseInt(timeRemaining / 60);
                    timeRemaining = (timeRemaining % 60);
                    seconds = parseInt(timeRemaining);
                    if ($('.countdown').length) {
                        $(".countdown #years")[0].innerHTML = parseInt(years, 10);
                        $(".countdown #days")[0].innerHTML = parseInt(days, 10);
                        $(".countdown #hours")[0].innerHTML = ("0" + hours).slice(-2);
                        $(".countdown #minutes")[0].innerHTML = ("0" + minutes).slice(-2);
                        $(".countdown #seconds")[0].innerHTML = ("0" + seconds).slice(-2);
                    }
                } else {return;}
            }

            function display(days, hours, minutes, seconds) {}
        }
        countdown('01/19/2030 03:14:07 AM');

        //Accordion Icons
        $('.accordion-btn').on('click',function(){
            $(this).addClass('no-click');
            $('.accordion-icon').removeClass('rotate-180');
            if($(this).attr("aria-expanded") == "true"){
                $(this).parent().find('.accordion-icon').removeClass('rotate-180');
            } else {
                $(this).parent().find('.accordion-icon').addClass('rotate-180');
            }
            setTimeout(function(){$('.accordion-btn').removeClass('no-click');},250);
        })

        //Caption Hovers
        $('.caption-scale').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('img').toggleClass('caption-scale-image');});  
        $('.caption-grayscale').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('img').toggleClass('caption-grayscale-image');});         
        $('.caption-rotate').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('img').toggleClass('caption-rotate-image');});       
        $('.caption-blur').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('img').toggleClass('caption-blur-image');});      
        $('.caption-hide').unbind().bind('mouseenter mouseleave touchstart touchend',function(){$(this).find('.caption-center, .caption-bottom, .caption-top, .caption-overlay').toggleClass('caption-hide-image');});

        //File Upload
        var uploadFile = $('.upload-file');
        function activate_upload_file(){
            function readURL(input) {
                if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                        $('.file-data img').attr('src', e.target.result);
                        $('.file-data img').attr('class','img-fluid rounded-xs mt-4');
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }
            $(".upload-file").change(function(e) {
                readURL(this);
                var fileName = e.target.files[0].name;
                $('.upload-file-data').removeClass('disabled');
                $('.upload-file-name').html(e.target.files[0].name)
                $('.upload-file-modified').html(e.target.files[0].lastModifiedDate);
                $('.upload-file-size').html(e.target.files[0].size/1000+'kb')
                $('.upload-file-type').html(e.target.files[0].type)
            });
        };
        if(uploadFile.length){activate_upload_file();}
        
        //Interest Check
        

        //Task List Check on Click
        var todo = $('.todo-list');
        function activate_todo_list(){
            $('.todo-list a').each(function(){
                if($(this).find('.form-check-input').prop('checked')){
                    $(this).addClass('opacity-70');
                } else {
                    $(this).removeClass('opacity-70');
                }
            })
            $('.todo-list a').on('click',function(){
                if($(this).find('input').attr('checked')){
                    $(this).removeClass('opacity-70')
                    $(this).find('input').removeAttr('checked')
                } else {
                    $(this).addClass('opacity-70')
                    $(this).find('input').attr('checked','true')
                }
                return false;
            })
        }
        if(todo.length){activate_todo_list();}
        
        var checkedCard = $('.check-card');
        function activate_checked_card(){
            $('.check-card').on('click',function(){
                if($(this).find('input').attr('checked')){
                    $('.check-card').find('input').removeAttr('checked')
                    $(this).find('input').removeAttr('checked')
                } else {
                    $('.check-card').find('input').removeAttr('checked')
                    $(this).find('input').attr('checked','true')
                }
                return false;
            })
        }
        if(checkedCard.length){activate_checked_card();}

        //Age Verification
        var checkAge = $('.check-age');
        function activate_age_checker(){
            console.log('active');
        $(".check-age").on('click',function(){    
            var dateBirghtDay = $("#date-birth-day").val();
            var dateBirthMonth = $("#date-birth-month").val();
            var dateBirthYear = $("#date-birth-year").val();
            var age = 18;
            var mydate = new Date();
            mydate.setFullYear(dateBirthYear, dateBirthMonth-1, dateBirghtDay);

            var currdate = new Date();
            var setDate = new Date();
            setDate.setFullYear(mydate.getFullYear() + age, dateBirthMonth-1, dateBirghtDay);

            if ((currdate - setDate) > 0){
                console.log("above 18");
                $('#menu-age').removeClass('menu-active')
                $('#menu-age-okay').addClass('menu-active');
            }else{
                $('#menu-age').removeClass('menu-active')
                $('#menu-age-fail').addClass('menu-active');
            }
            return true;
        });
        } 
        if(checkAge.length){activate_age_checker();}


        //Geolocation
        var geoLocation = $('.get-location');
        function activate_geolocation(){
            if ("geolocation" in navigator) {
                $('.location-support').html('Your browser and device <strong class="color-green-dark">support</strong> Geolocation.');
            } else {
                $('.location-support').html('Your browser and device <strong class="color-red-dark">support</strong> Geolocation.');
            }
            function geoLocate() {
                const locationCoordinates = document.querySelector('.location-coordinates');
                function success(position) {
                    const latitude  = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    locationCoordinates.innerHTML = '<strong>Longitude:</strong> ' + longitude + '<br><strong>Latitude:</strong> '+ latitude;

                    var mapL1 = 'http://maps.google.com/maps?q=';
                    var mapL2 = latitude+',';
                    var mapL3 = longitude;
                    var mapL4 = '&z=18&t=h&output=embed'
                    var mapL5 = '&z=18&t=h'
                    var mapLinkEmbed = mapL1 + mapL2 + mapL3 + mapL4;
                    var mapLinkAddress = mapL1 + mapL2 + mapL3 + mapL5;

                    $('.location-map').after('<iframe class="location-map" src="'+mapLinkEmbed+'"></iframe> <div class="clearfix"></div>');
                    $('.location-map').parent().after(' <a href='+mapLinkAddress+' class="btn btn-full btn-l bg-red-dark rounded-0 font-700 mb-n1">View on Google Maps</a>');
                }
                function error() {
                    locationCoordinates.textContent = 'Unable to retrieve your location';
                }
                if (!navigator.geolocation) {
                    locationCoordinates.textContent = 'Geolocation is not supported by your browser';
                } else {
                    locationCoordinates.textContent = 'Locating';
                    navigator.geolocation.getCurrentPosition(success, error);
                }
            }
            $('.get-location').on('click',function(){
                $(this).addClass('disabled');
                geoLocate();
            });
        };
        if(geoLocation.length){activate_geolocation();}

        var emailValidator = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        var phoneValidator = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        var nameValidator = /[A-Za-z]{2}[A-Za-z]*[ ]?[A-Za-z]*/;
        var passwordValidator = /[A-Za-z]{2}[A-Za-z]*[ ]?[A-Za-z]*/;
        var urlValidator = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
        var textareaValidator = /[A-Za-z]{2}[A-Za-z]*[ ]?[A-Za-z]*/;
        var validIcon = "<i class='fa fa-check color-green-dark'></i>";
        var invalidIcon = "<i class='fa fa-exclamation-triangle color-red-light'></i>";

        $('.input-required input, .input-required select, .input-required textarea').on('focusin keyup',function(){
            var spanValue = $(this).parent().find('span').text();
            if($(this).val() != spanValue && $(this).val() != ""){
                $(this).parent().find('span').addClass('input-style-1-active').removeClass('input-style-1-inactive');
            }    
            if($(this).val() === ""){
                $(this).parent().find('span').removeClass('input-style-1-inactive input-style-1-active');
            }
        });      
        $('.input-required input, .input-required select, .input-required textarea').on('focusout',function(){
            var spanValue = $(this).parent().find('span').text();
            if($(this).val() === ""){
                $(this).parent().find('span').removeClass('input-style-1-inactive input-style-1-active');
            }
            $(this).parent().find('span').addClass('input-style-1-inactive')
        });
        $('.input-required select').on('focusout',function(){
            var getValue = $(this)[0].value;
            if(getValue === "default"){
                $(this).parent().find('em').html(invalidIcon)
                $(this).parent().find('span').removeClass('input-style-1-inactive input-style-1-active');
            } 
            if(getValue != "default"){
                $(this).parent().find('em').html(validIcon)
            }                
        });
        $('.input-required input[type="email"]').on('focusout',function(){if (emailValidator.test($(this).val())){$(this).parent().find('em').html(validIcon);}else{if($(this).val() === ""){$(this).parent().find('em').html("(required)");}else{$(this).parent().find('em').html(invalidIcon);}}});       
        $('.input-required input[type="tel"]').on('focusout',function(){if (phoneValidator.test($(this).val())){$(this).parent().find('em').html(validIcon);}else{if($(this).val() === ""){$(this).parent().find('em').html("(required)");}else{$(this).parent().find('em').html(invalidIcon);}}});
        $('.input-required input[type="password"]').on('focusout',function(){if (passwordValidator.test($(this).val())){$(this).parent().find('em').html(validIcon);}else{if($(this).val() === ""){$(this).parent().find('em').html("(required)");}else{$(this).parent().find('em').html(invalidIcon);}}});          
        $('.input-required input[type="url"]').on('focusout',function(){if (urlValidator.test($(this).val())){$(this).parent().find('em').html(validIcon);}else{if($(this).val() === ""){$(this).parent().find('em').html("(required)");}else{$(this).parent().find('em').html(invalidIcon);}}});  
        $('.input-required input[type="name"]').on('focusout',function(){if (nameValidator.test($(this).val())){$(this).parent().find('em').html(validIcon);}else{if($(this).val() === ""){$(this).parent().find('em').html("(required)");}else{$(this).parent().find('em').html(invalidIcon);}}});      
        $('.input-required textarea').on('focusout',function(){if (textareaValidator.test($(this).val())){$(this).parent().find('em').html(validIcon);}else{if($(this).val() === ""){$(this).parent().find('em').html("(required)");}else{$(this).parent().find('em').html(invalidIcon);}}});  


        //Set Today Date to Date Inputs
        Date.prototype.toDateInputValue = (function() {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0,10);
        });
        $('input[type="date"]').val(new Date().toDateInputValue());

        //QR Generator
        var generateQR = $('.generate-qr-result, .generate-qr-auto');
        function activate_qr_generator(){
            //QR Code Generator 
            var qr_auto_link = window.location.href;
            var qr_api_address = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=';

            $('.generate-qr-auto').attr('src', qr_api_address+qr_auto_link)
            $('.generate-qr-button').on('click',function(){
                if($(this).parent().find('.fa').hasClass('fa-exclamation-triangle')){
                    console.log('Invalid URL');
                } else {
                    var get_qr_url = $('.generate-qr-input').val();
                    if(!get_qr_url == ''){
                        $('.generate-qr-result').empty();
                        setTimeout(function(){
                            $('.generate-qr-result').append('<img class="mx-auto polaroid-effect shadow-l mt-4 delete-qr" width="200" src="'+qr_api_address+get_qr_url+'" alt="img"><p class="font-11 text-center mb-0">'+get_qr_url+'</p>')
                        },30);
                    }
                }
            });
        }
        if(generateQR.length){activate_qr_generator();}

        //Vibrate Buttons
        var vibrateButton = $('[data-vibrate]');
        function activate_vibration(){
            $('[data-vibrate]').on('click',function(){var vibrateTime = $(this).data('vibrate'); window.navigator.vibrate(vibrateTime);});
            $('.start-vibrating').on('click',function(){var vibrateTimeInput = $('.vibrate-demo').val(); window.navigator.vibrate(vibrateTimeInput);})
            $('.stop-vibrating').on('click',function(){window.navigator.vibrate(0); $('.vibrate-demo').val(''); });
        }
        if(vibrateButton.length){
            activate_vibration();
        }

        //Sharing
        function sharingLinks(){
            var share_link = window.location.href;
            var share_title = document.title;
            $('.shareToFacebook').prop("href", "https://www.facebook.com/sharer/sharer.php?u="+share_link)
            $('.shareToLinkedIn').prop("href", "https://www.linkedin.com/shareArticle?mini=true&url="+share_link+"&title="+share_title+"&summary=&source=")
            $('.shareToTwitter').prop("href", "https://twitter.com/home?status="+share_link)
            $('.shareToPinterest').prop("href", "https://pinterest.com/pin/create/button/?url=" + share_link)
            $('.shareToWhatsApp').prop("href", "whatsapp://send?text=" + share_link)
            $('.shareToMail').prop("href", "mailto:?body=" + share_link);
            //Copy Link
            $('.shareToCopyLink').on('click',function(element){
                $(this).parent().find('p').html('Link Copied');
                $(this).removeClass('color-blue-dark').addClass('color-green-dark');
                $(this).find('i').attr('class','');
                $(this).find('i').attr('class','fa fa-check font-12');
                setTimeout(function(){
                    $('.shareToCopyLink').parent().find('p').html('Copy Link');
                    $('.shareToCopyLink').removeClass('color-green-dark').addClass('color-blue-dark');
                    $('.shareToCopyLink').find('i').attr('class','');
                    $('.shareToCopyLink').find('i').attr('class','fa fa-link font-14');
                },1000);
                var $temp = $("<input>");
                $("body").append($temp);
                $temp.val(share_link).select();
                document.execCommand("copy");
                $temp.remove();
            });

        };
        sharingLinks();

        //Preload Image
        var preloadImages = $('.preload-img');
        $(function() {preloadImages.lazyload({threshold : 500});});

        //LightBox
        $('[data-lightbox]').addClass('default-link');
        lightbox.option({alwaysShowNavOnTouchDevices:true, 'resizeDuration': 200, 'wrapAround': false})
        $('#lightbox').hammer().on("swipe", function (event) {
            if (event.gesture.direction === 4) {
                $('#lightbox a.lb-prev').trigger('click');
            } else if (event.gesture.direction === 2) {
                $('#lightbox a.lb-next').trigger('click');
            }
        });
        
        

        //Filterable
        if($('.gallery-filter-links').length > 0){ 
            $('.gallery-filter-links').filterizr();
            $('.gallery-filter-active').addClass('color-highlight');
        }		
        if($('.gallery-filter-select').length > 0){
            $('.gallery-filter-select').filterizr();
            $('#filter-select').change(function(){
                var filterFind = $(this).val(); 
                $('[data-filter='+filterFind+']').trigger('click');
            })
        }
        $('.gallery-filter-controls li').on('click',function(){
            $('.gallery-filter-controls li').removeClass('gallery-filter-active color-highlight');	
            $(this).addClass('gallery-filter-active color-highlight');	
        });

        //Gallery Views // Added in 2.0
        var galleryViews = $('.gallery-views');
        var galleryViewControls = $('.gallery-view-controls a');
        var galleryView1 = $('.gallery-view-1-activate');
        var galleryView2 = $('.gallery-view-2-activate');
        var galleryView3 = $('.gallery-view-3-activate');

        galleryView1.on('click',function(){
            galleryViewControls.removeClass('color-highlight');
            $(this).addClass('color-highlight');
            galleryViews.removeClass().addClass('gallery-views gallery-view-1');
        });
        galleryView2.on('click',function(){
            galleryViewControls.removeClass('color-highlight');
            $(this).addClass('color-highlight');
            galleryViews.removeClass().addClass('gallery-views gallery-view-2');
        });  
        galleryView3.on('click',function(){
            galleryViewControls.removeClass('color-highlight');
            $(this).addClass('color-highlight');
            galleryViews.removeClass().addClass('gallery-views gallery-view-3');
        });

        //Contact Form
        var formSubmitted = "false";
        jQuery(document).ready(function(e) {
            function t(t, n) {
                formSubmitted = "true";
                var r = e("#" + t).serialize();
                e.post(e("#" + t).attr("action"), r, function(n) {
                    e("#" + t).addClass('disabled');
                    $('.contact-form').addClass('disabled');
                    e(".formSuccessMessageWrap").fadeIn(500)
                })
            }
            function n(n, r) {
                e(".formValidationError").hide();
                e(".fieldHasError").removeClass("fieldHasError");
                e("#" + n + " .requiredField").each(function(i) {
                    if (e(this).val() == "" || e(this).val() == e(this).attr("data-dummy")) {
                        e(this).val(e(this).attr("data-dummy"));
                        e(this).focus();
                        e(this).addClass("fieldHasError");
                        e("#" + e(this).attr("id") + "Error").fadeIn(300);
                        return false
                    }
                    if (e(this).hasClass("requiredEmailField")) {
                        var s = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                        var o = "#" + e(this).attr("id");
                        if (!s.test(e(o).val())) {
                            e(o).focus();
                            e(o).addClass("fieldHasError");
                            e(o + "Error2").fadeIn(300);
                            return false
                        }
                    }
                    if (formSubmitted == "false" && i == e("#" + n + " .requiredField").length - 1) {
                        t(n, r)
                    }
                })
            }
            e(".formSuccessMessageWrap").hide(0);
            e(".formValidationError").fadeOut(0);
            e('input[type="text"], input[type="password"], textarea').focus(function() {
                if (e(this).val() == e(this).attr("data-dummy")) {
                    e(this).val("")
                }
            });
            e("input, textarea").blur(function() {
                if (e(this).val() == "") {
                    e(this).val(e(this).attr("data-dummy"))
                }
            });
            e(".contactSubmitButton").on('click',function() {
                n(e(this).attr("data-formId"));
                return false
            })
        });
        
        //Charts
		if($('.chart').length > 0){
			var loadJS = function(url, implementationCode, location){
				var scriptTag = document.createElement('script');
				scriptTag.src = url;
				scriptTag.onload = implementationCode;
				scriptTag.onreadystatechange = implementationCode;
				location.appendChild(scriptTag);
			};
			var call_charts_to_page = function(){
                
                var walletChart = $('#wallet-chart');
                var pieChart = $('#pie-chart');
                var doughnutChart = $('#doughnut-chart');
                var polarChart = $('#polar-chart');
                var verticalChart = $('#vertical-chart');
                var horizontalChart = $('#horizontal-chart');
                var lineChart = $('#line-chart');

                if(walletChart.length){
                    var walletDemoChart = new Chart(walletChart, {
                        type: 'bar',
                        data: {
                          labels: ["Jun", "Jul", "Aug"],
                          datasets: [
                            {
                              label: "Expenses",
                              backgroundColor: "#ED5565",
                              data: [100,100,130]
                            }, {
                              label: "Income",
                              backgroundColor: "#A0D468",
                              data: [170,145,165]
                            }, {
                              label: "Subscriptions",
                              backgroundColor: "#4A89DC",
                              data: [71,50,70]
                            }
                          ]
                        },
                        options: {
                            responsive: true, maintainAspectRatio:false,
                            legend: {display: true, position:'bottom', labels:{fontSize:13, padding:15,boxWidth:12},},
                            title: {display: false}
                        }
                    });	
                }
                
                if(pieChart.length){
                    var pieDemoChart = new Chart(pieChart, {
                        type: 'pie',
                        data: {
                          labels: ["Facebook", "Twitter", "WhatsApp"],
                          datasets: [{
                            backgroundColor: ["#4A89DC", "#4FC1E9", "#A0D468"],
                            borderColor:"rgba(255,255,255,0.5)",
                            data: [7000,3000,2000]
                          }]
                        },
                        options: {
                            responsive: true, maintainAspectRatio:false,
                            legend: {display: true, position:'bottom', labels:{fontSize:13, padding:15,boxWidth:12},},
                            tooltips:{enabled:true}, animation:{duration:1500}
                        }
                    });		
                }

                if(doughnutChart.length){
                    var doughnutDemoChart = new Chart(doughnutChart, {
                        type: 'doughnut',
                        data: {
                          labels: ["Apple", "Samsung", "Google"],
                          datasets: [{
                            backgroundColor: ["#CCD1D9", "#5D9CEC","#FC6E51"],
                            borderColor:"rgba(255,255,255,0.5)",
                            data: [5500,4000,3000]
                          }]
                        },
                        options: {
                            responsive: true, maintainAspectRatio:false,
                            legend: {display: true, position:'bottom', labels:{fontSize:13, padding:15,boxWidth:12},},
                            tooltips:{enabled:true}, animation:{duration:1500}, layout:{ padding: {bottom: 30}}
                        }
                    });		
                }

                if(polarChart.length){
                    var polarDemoChart = new Chart(polarChart, {
                        type: 'polarArea',
                        data: {
                          labels: ["Windows", "Mac", "Linux"],
                          datasets: [{
                            backgroundColor: ["#CCD1D9", "#5D9CEC","#FC6E51"],
                            borderColor:"rgba(255,255,255,0.5)",
                            data: [7000,10000,5000]
                          }]
                        },
                        options: {
                            responsive: true, maintainAspectRatio:false,
                            legend: {display: true, position:'bottom', labels:{fontSize:13, padding:15,boxWidth:12},},
                            tooltips:{enabled:true}, animation:{duration:1500}, layout:{ padding: {bottom: 30}}
                        }
                    });	
                }

                if (verticalChart.length){
                    var verticalDemoChart = new Chart(verticalChart, {
                        type: 'bar',
                        data: {
                          labels: ["2010", "2015", "2020",],
                          datasets: [
                            {
                              label: "iOS",
                              backgroundColor: "#A0D468",
                              data: [900,1000,1150]
                            }, {
                              label: "Android",
                              backgroundColor: "#4A89DC",
                              data: [890,950,1100]
                            }
                          ]
                        },
                        options: {
                            responsive: true, maintainAspectRatio:false,
                            legend: {display: true, position:'bottom', labels:{fontSize:13, padding:15,boxWidth:12},},
                            title: {display: false}
                        }
                    });	
                }

                if(horizontalChart.length){
                    var horizontalDemoChart = new Chart(horizontalChart, {
                        type: 'horizontalBar',
                        data: {
                          labels: ["2010", "2013", "2016", "2020"],
                          datasets: [
                            {
                              label: "Mobile",
                              backgroundColor: "#BF263C",
                              data: [330,400,580,590]
                            }, {
                              label: "Responsive",
                              backgroundColor: "#EC87C0",
                              data: [390,450,550,570]
                            }
                          ]
                        },
                        options: {
                            legend: {display: true, position:'bottom', labels:{fontSize:13, padding:15,boxWidth:12},},
                            title: {display: false}
                        }
                    });	
                }

                if(lineChart.length){
                    var lineDemoChart = new Chart(lineChart, {
                      type: 'line',
                      data: {
                        labels: [2000,2005,2010,2015,2010],
                        datasets: [{ 
                            data: [500,400,300,200,300],
                            label: "Desktop Web",
                            borderColor: "#D8334A"
                          }, { 
                            data: [0,100,300,400,500],
                            label: "Mobile Web",
                            borderColor: "#4A89DC"
                          }
                        ]
                      },
                      options: {
                        responsive: true, maintainAspectRatio:false,
                        legend: {display: true, position:'bottom', labels:{fontSize:13, padding:15,boxWidth:12},},
                        title: {display: false}
                      }
                    });
                }
			}
			loadJS('scripts/charts.js', call_charts_to_page, document.body);
		}        
        
        //Activate the PWA    
        if(pwaEnabled === true){
            
            //Setting Timeout Before Prompt Shows Again if Dismissed
            var now = new Date(); var start = new Date(now.getFullYear(), 0, 0); var diff = now - start; var oneDay = 1000 * 60 * 60 * 24; var day = Math.floor(diff / oneDay);
            var dismissDate = localStorage.getItem('Appkit-PWA-Timeout-Value');
            if((day - dismissDate) > pwaRemind){
                localStorage.removeItem('Appkit-PWA-Prompt')
            } 
                
            //Dismiss Prompt Button
            $('.pwa-dismiss').on('click',function(){
                console.log('User Closed Add to Home / PWA Prompt')
                localStorage.setItem('Appkit-PWA-Prompt', 'install-rejected');
                $('body').find('#menu-install-pwa-android, #menu-install-pwa-ios, .menu-hider').removeClass('menu-active'); 
                localStorage.setItem('Appkit-PWA-Timeout-Value', day);
            });

            //Detecting Mobile Operating Systems
            var isMobile = {
                Android: function() {return navigator.userAgent.match(/Android/i);},
                iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
                any: function() {return (isMobile.Android() || isMobile.iOS() || isMobile.Windows());}
            };
            var isInWebAppiOS = (window.navigator.standalone == true);
            var isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);

            //Trigger Install Prompt for Android
            if (isMobile.Android()) {
                function showInstallPrompt(){
                    if($('#menu-install-pwa-android, .add-to-home').length){
                        if (localStorage.getItem('Appkit-PWA-Prompt') != "install-rejected") {
                            setTimeout(function(){
                                $('.add-to-home').addClass('add-to-home-visible add-to-home-android');
                                $('#menu-install-pwa-android, .menu-hider').addClass('menu-active')
                            },4500);
                            console.log('Triggering PWA Window for Android');
                        } else {
                            console.log('PWA Install Rejected. Will Show Again in '+ (dismissDate-day + pwaRemind)+' Days')
                        }
                    } else {
                        console.log('The div #menu-install-pwa-android was not found. Please add this div to show the install window')
                    }
                }
                let deferredPrompt;
                window.addEventListener('beforeinstallprompt', (e) => {
                    e.preventDefault();
                    deferredPrompt = e;
                    showInstallPrompt();
                });
                $('.pwa-install').on('click',function(e){
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice
                    .then((choiceResult) => {
                      if (choiceResult.outcome === 'accepted') {
                        //console.log('User accepted the A2HS prompt');
                      } else {
                        //console.log('User dismissed the A2HS prompt');
                      }
                      deferredPrompt = null;
                    });
                });
                window.addEventListener('appinstalled', (evt) => {
                    $('#menu-install-pwa-android, .menu-hider').removeClass('menu-active')
                });
            }  

            //Trigger Install Guide iOS
            if (isMobile.iOS()) {
                if(!isInWebAppiOS){
                    if($('#menu-install-pwa-ios, .add-to-home').length){
                        if (localStorage.getItem('Appkit-PWA-Prompt') != "install-rejected") {
                            console.log('Triggering PWA Window for iOS');
                            setTimeout(function(){
                                $('.add-to-home').addClass('add-to-home-visible add-to-home-ios');
                                $('#menu-install-pwa-ios, .menu-hider').addClass('menu-active');
                            },4500);
                        } else {
                            console.log('PWA Install Rejected. Will Show Again in '+ (dismissDate-day + pwaRemind)+' Days')
                        };
                    } else {
                        console.log('The div #menu-install-pwa-ios was not found. Please add this div to show the install window')
                    }
                }
            }    

            //Adding Offline Alerts
            var offlineAlerts = $('.offline-message');
            if(!offlineAlerts.length){
                $('body').append('<p class="offline-message bg-red-dark color-white center-text uppercase ultrabold">No internet connection detected</p> ');
                $('body').append('<p class="online-message bg-green-dark color-white center-text uppercase ultrabold">You are back online</p>');
            }
            //Offline Function Show
            function isOffline(){
                $('.offline-message').addClass('offline-message-active');
                $('.online-message').removeClass('online-message-active');
                setTimeout(function(){$('.offline-message').removeClass('offline-message-active');},2000);
            }
            //Online Function Show
            function isOnline(){
                $('.online-message').addClass('online-message-active');
                $('.offline-message').removeClass('offline-message-active');
                setTimeout(function(){$('.online-message').removeClass('online-message-active');},2000);
            }    
            $('.simulate-offline').on('click',function(){isOffline();})
            $('.simulate-online').on('click',function(){isOnline();})

            //Disable links to other pages if offline. Warning! Enabling offline for iOS can cause issues
            function returnFalse(){ var detectHREF = $(this).attr('href'); if(detectHREF.match(/.html/)){isOffline(); return false; }  }  

            //Check if Online / Offline
            function updateOnlineStatus(event) {var condition = navigator.onLine ? "online" : "offline"; isOnline(); console.log( 'Connection: Online'); $("a").off( "click", returnFalse );}
            function updateOfflineStatus(event) {isOffline();$("a").on( "click", returnFalse ); console.log( 'Connection: Offline');}
            window.addEventListener('online',  updateOnlineStatus);
            window.addEventListener('offline', updateOfflineStatus);

            // if(pwaNoCache == true){
            //     caches.delete('workbox-runtime').then(function() {});
            //     sessionStorage.clear()
            //     caches.keys().then(cacheNames => {
            //       cacheNames.forEach(cacheName => {
            //         caches.delete(cacheName);
            //       });
            //     });
            // }
        }

        //Externally loaded menu system.
        var menuLoad = $('[data-menu-load]');
        menuLoad.each(function(){
            var loader = $(this).data('menu-load');
            $(this).load(loader);
        }).promise().done(function(){ 
            setTimeout(function(){
                sharingLinks();
                card_extender();
                darkMode();
                menuFunctions();
                sharingLinks();
                highlightLoader();
                backToTop();
            },500);
        });

        //Local Error Message
        if (window.location.protocol === "file:"){$('a').on('mouseover',function(){console.log("You are seeing these errors because your file is on your local computer. For real life simulations please use a Live Server or a Local Server such as AMPPS or WAMPP or simulate a  Live Preview using a Code Editor like http://brackets.io (it's 100% free) - PWA functions and AJAX Page Transitions will only work in these scenarios.");});}         
    }
    //Activating all the plugins
	setTimeout(init_template, 0);
               
    //Activate AJAX Transitions    
    if(isAJAX === true){
        $(function(){
            'use strict';
            var options = {
                prefetch: false,
                prefetchOn: 'mouseover',
                cacheLength: 100,
                scroll: true, 
                blacklist: '.default-link',
                forms: 'contactForm',
                onStart: {
                    duration:180, // Duration of our animation
                    render: function ($container) {
                    $container.addClass('is-exiting');// Add your CSS animation reversing class
                        $('.menu, .menu-hider').removeClass('menu-active');
                        $('#preloader').removeClass('preloader-hide');
                        return false;
                    }
                },
                onReady: {
                    duration: 30,
                    render: function ($container, $newContent) {
                        $container.removeClass('is-exiting');// Remove your CSS animation reversing class
                        $container.html($newContent);// Inject the new content
                        setTimeout(init_template, 0)//Timeout required to properly initiate all JS Functions. 
                        $('#preloader').removeClass('preloader-hide');
                    }
                },
                onAfter: function($container, $newContent) {
                    //Back Button Scroll Stop
                    if ('scrollRestoration' in history) {history.scrollRestoration = 'manual';}
                    setTimeout(function(){
                        $('.menu').css('display','block');
                        $('#preloader').addClass('preloader-hide');
                    },180);
                }
            };
          var smoothState = $('#page').smoothState(options).data('smoothState');
           smoothState.clear();
        });
    }

    //Activate Development mode. Keeps caches clear.
    if(isDevMode === true){
        if(!$('.reloader').length){$('body').append('<a href="#" class="reloader" style="opacity:1; position:fixed; background-color:#000; color:#FFF; z-index:9999; bottom:100px; left:50%; margin-left:-70px; border-radius:10px; width:140px; line-height:40px; text-align:center;">Developer Mode</a>');}
        $('.reloader').on('click',function(){window.location.reload(true);})
        caches.delete('workbox-runtime').then(function(){});
        sessionStorage.clear()
        localStorage.clear();
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
    }
    
    //Registering The Service Worker    
    if(pwaEnabled === true){
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('_service-worker.js', {scope: ''});
          });
        }    
    }    
}); 