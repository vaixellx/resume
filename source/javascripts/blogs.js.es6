window.blogPath = () => {
    if (window.location.host.match(/localhost/)) {
        return 'blog/?id='
    } else {
        return 'readblog/'
    }
}

if ($('body.blogs_index').length) {
    $(document).ready(function(){
        var backendUrl = $('meta[name="backend-host"]').attr('content')
        var article_url = `${backendUrl}/articles?_sort=published_at%3Adesc`;

        $.ajax({
            url: article_url,
            type:'GET',
            beforeSend: function(data) {
                $("#loader-page-blogs-title").css('display', 'block');
            },
            success: function(response)
            {
                var data = response.length > 0 ? response.filter((element) => new Date(element.published_at) < new Date()) : [];

                let display = `
                    <div class="row">
                        <div class="col-12 col-lg-8">
                            <a href="/`+blogPath()+``+data[0].id+`" class="d-block article mb-4 mb-lg-3">
                                <img src=`+data[0].cover_url+` class="rounded img-fluid"/>
                                <div class="mt-3" id="badge"></div>
                                <h4 class="mt-2 mb-0">`+data[0].title+`</h4>
                            </a>
                        </div>

                        <div class="col-12 col-lg-4">
                            <div class="text-left">
                                <h4 class="mb-3">บทความล่าสุด</h4>
                            </div>
                            <div id="article_content"></div>
                        </div>
                    </div>
                `;

                $("#results").html(display);

                let firstDataSortOrder = data[0].article_categories.length > 0 ? data[0].article_categories.sort((a, b) => a.order - b.order) : [];
                let badge = "";
                for (let i = 0 ; i < firstDataSortOrder.length ; i++) {
                    badge += `<a href="/category/?id=`+firstDataSortOrder[i].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ firstDataSortOrder[i].name +`</a>`;
                }
                $("#badge").html(badge);

                let article_content = "";

                for (let article_index = 1 ; article_index <= data.slice(1, 5).length ; article_index++) {
                    article_content += `
                                <div class="row">
                                    <div class="col-4 col-md-3 col-lg-5 col-xl-4">
                                        <a href="/`+blogPath()+``+data[article_index].id+`" class="d-block article mb-4 mb-lg-2">
                                            <div class="article-square-thumbnail" style="background-image: url(`+ data[article_index].cover_url +`)"></div>
                                        </a>
                                    </div>
                                    <div class="col-8 col-md-9 col-lg-7 col-xl-8 pl-0">
                                        <div class="mt-4 mb-3 d-none d-sm-block d-lg-none"></div>`;

                                        let dataSortOrder = data[article_index].article_categories.length > 0 ? data[article_index].article_categories.sort((a, b) => a.order - b.order) : [];

                                        for (let category = 0 ; category < dataSortOrder.length ; category++) {
                                            article_content += `<a href="/category/?id=`+dataSortOrder[category].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ dataSortOrder[category].name +`</a>`;
                                        };

                                        article_content += `<a href="/`+blogPath()+``+data[article_index].id+`" class="d-block article mb-4 mb-lg-2"><div class="article-compact-title">`+data[article_index].title+`</div></a>
                                    </div>
                                </div>
                            <hr class="mt-0 mb-4 mb-lg-2">`;
                    $("#article_content").html(article_content);
                }

            },
            error: function(err)
            {
                console.log(err);
            },
            complete: function(data)
            {
                $("#loader-page-blogs-title").css('display', 'none');
            },
        });

        let article_category_url = `${backendUrl}/article-categories?_sort=order%3Aasc`;

        $.ajax({
            url: article_category_url,
            type:'GET',
            beforeSend: function(data) {
                $("#loader-page-blogs-content").css('display', 'block');
            },
            success: function(categories)
            {

                $.ajax({
                    url: article_url,
                    type:'GET',
                    success: function(article_data)
                    {

                        let category_tags = "";
                        let dataCategoryPillSortOrder = categories.length > 0 ? categories.sort((a, b) => a.order - b.order) : [];

                        for(let i = 0; i < dataCategoryPillSortOrder.length; i++ ) {
                            category_tags += `
                                <a href="/category/?id=`+dataCategoryPillSortOrder[i].id+`" class="badge badge-pill badge-category mt-3 mr-2">
                                    `+ dataCategoryPillSortOrder[i].name +`
                                </a>
                            `;
                        }
                        $("#categories-tag").html(category_tags);

                        let categoriesContentFirst = "";

                            for (let cate_index = 0; cate_index < categories.length; cate_index++ ) {

                                var onTime = categories[cate_index].articles.length > 0 ? categories[cate_index].articles.filter((element) => {if (new Date(element.published_at) < new Date()) return categories[cate_index] }) : [];

                                var filter_article_categories = onTime.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

                                if (filter_article_categories.length > 0) {
                                    categoriesContentFirst += `<div class="row mb-4">
                                                                    <div class="col-12 col-md-6">
                                                                        <h3 class="mb-0 mt-4">` + categories[cate_index].name + `</h3>
                                                                    </div>
                                                                    <div class="col-12 col-md-6 text-left text-md-right">
                                                                        <a href="/category/?id=`+categories[cate_index].id+`" class="d-block mt-1 text-success mb-0 mt-4">ดูบทความทั้งหมด</a>
                                                                    </div>
                                                                </div>`;

                                    categoriesContentFirst += `<div class="row">`;

                                    let lastElement = filter_article_categories.length >= 5 ? 4 : filter_article_categories.length - 1;

                                    for (let i = 0; i < filter_article_categories.slice(0, 5).length; i++) {

                                        let article_category_badge = article_data.length > 0 ? article_data.filter((article_element) => article_element.id == filter_article_categories[i].id) : [];

                                        if(i < 2) {
                                            categoriesContentFirst += `
                                                <div class="col-12 col-lg-4">
                                                    <a href="/`+blogPath()+``+filter_article_categories[i].id+`" class="d-block article mb-4 mb-lg-3">
                                                        <img src=`+ filter_article_categories[i].cover_url +` class="rounded img-fluid" />
                                                    </a>
                                                    <div class="mt-2">`;
                                                        let coupleDataSortOrder = article_category_badge[0].article_categories.length > 0 ? article_category_badge[0].article_categories.sort((a, b) => a.order - b.order) : [];

                                                        if(coupleDataSortOrder.length > 0) {
                                                            for (let j = 0 ; j < coupleDataSortOrder.length ; j++) {
                                                                categoriesContentFirst += `<a href="/category/?id=`+coupleDataSortOrder[j].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ coupleDataSortOrder[j].name +`</a>`;
                                                            }
                                                        }
                                                    categoriesContentFirst += `</div>
                                                    <a href="/`+blogPath()+``+filter_article_categories[i].id+`" class="d-block article mb-4 mb-lg-3">
                                                        <div class="mt-2">`
                                                            + filter_article_categories[i].title +
                                                        `</div>
                                                    </a>
                                                </div>
                                            `;
                                        }

                                        if(i >= 2 && i <=4){
                                            if(i == 2){
                                                categoriesContentFirst += `<div class="col-12 col-lg-4">`;
                                            }
                                            categoriesContentFirst += `
                                                    <div class="row">
                                                        <div class="col-4 col-md-3 col-lg-5 col-xl-4">
                                                            <a href="/`+blogPath()+``+filter_article_categories[i].id+`" class="d-block article mb-4 mb-lg-2">
                                                                <div class="article-square-thumbnail" style="background-image: url(`+ filter_article_categories[i].cover_url +`)"></div>
                                                            </a>
                                                        </div>

                                                        <div class="col-8 col-md-9 col-lg-7 col-xl-8 pl-0">
                                                            <div class="mt-4 mb-3 d-none d-sm-block d-lg-none"></div>`;
                                                                let dataSortOrder = article_category_badge[0].article_categories.length > 0 ? article_category_badge[0].article_categories.sort((a, b) => a.order - b.order) : [];

                                                                if(dataSortOrder.length > 0) {
                                                                    for (let j = 0 ; j < dataSortOrder.length ; j++) {
                                                                        categoriesContentFirst += `<a href="/category/?id=`+dataSortOrder[j].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ dataSortOrder[j].name +`</a>`;
                                                                    }
                                                                }
                                                            categoriesContentFirst += `
                                                            <a href="/`+blogPath()+``+filter_article_categories[i].id+`" class="d-block article mb-4 mb-lg-2">
                                                                <div class="article-compact-title">`
                                                                    + filter_article_categories[i].title +
                                                                `</div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                <hr class="mt-0 mb-4 mb-lg-2">
                                            `;
                                            if(i == lastElement ){
                                                categoriesContentFirst += `</div>`;
                                            }
                                        }
                                    }

                                    categoriesContentFirst += "</div>";
                                }
                            }

                        $("#categories-content").html(categoriesContentFirst);

                        },
                        error: function(err)
                        {
                            console.log(err);
                        },
                        complete: function(data)
                        {
                            $("#loader-page-blogs-content").css('display', 'none');
                        },
                    });

            },
            error: function(err)
            {
                console.log(err);
            }
        });
    })
}

if ($('body.blog_index').length) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var param_id = url.searchParams.get("id");
    var backendUrl = $('meta[name="backend-host"]').attr('content')
    var article_url_by_id = `${backendUrl}/articles/${param_id}`;
    var related_article_category = [];
    var current_article_id = 0;

    $.ajax({
        url: article_url_by_id,
        type:'GET',
        beforeSend: function(data) {
            $("#loader-page-blog-title").css('display', 'block');
        },
        success: function(data)
        {

            let title = data.title + " | จินตนาการ สืบสาน วรรณกรรมไทยกับอินทัช ปีที่ 15 - Intouchstation";

            $('title').text(title);

            $('meta[property="og:title"]').attr('content', title);

            $('meta[property="og:image"]').attr('content', data.cover_url);

            current_article_id = data.id;

            var date = new Date(data.published_at)
            var format_date = date.toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })

            let display = `
                <div class="row">
                    <div class="col-12 col-lg-8">
                        <div class="d-block article mb-4 mb-lg-3">
                            <img src=`+data.cover_url+` class="rounded img-fluid"/>

                            <div class="mt-3" id="badge"></div>

                            <div class="mt-2 blog-article-category-title">`+data.title+`</div>

                            <small class="mt-3 text-muted">
                                <span class="article-date pr-3">
                                <i class="far fa-calendar-alt pr-1"></i>
                                    `+format_date+`
                                </span>
                            </small>
                        </div>
                        <hr class="mt-0 mb-4 mb-lg-4">
                    </div>
                </div>
            `;

            $("#results").html(display);
            $("#html-body-inner").html(data.content_html);

            let categoryPillSortOrder = data.article_categories.length > 0 ? data.article_categories.sort((a, b) => a.order - b.order) : [];
            let badge = "";
            for (let i = 0 ; i < categoryPillSortOrder.length ; i++) {
                badge += `<a href="/category/?id=`+categoryPillSortOrder[i].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ categoryPillSortOrder[i].name +`</a>`;
                related_article_category.push(categoryPillSortOrder[i])
            }
            $("#badge").html(badge);

            let article_category_url = `${backendUrl}/article-categories?_sort=order%3Aasc`;
            let article_url = `${backendUrl}/articles?_sort=published_at%3Adesc`;

            $.ajax({
                url: article_category_url,
                type:'GET',
                beforeSend: function(data) {
                    $("#loader-page-blog-related").css('display', 'block');
                },
                success: function(response)
                {

                    $.ajax({
                        url: article_url,
                        type:'GET',
                        success: function(article_data)
                        {

                            if(related_article_category.length > 0){

                                var categories = response.filter((category) => category.id == related_article_category[0].id);

                                let categoriesContentRandom = "";

                                for (let cate_index = 0; cate_index < categories.length; cate_index++ ) {

                                    var overthanCurrentDate = categories[cate_index].articles.length > 0 ? categories[cate_index].articles.filter((element) => (new Date(element.published_at) < new Date()) && (element.id != current_article_id)) : [];

                                    var filter_article_categories = overthanCurrentDate.sort(() => 0.5 - Math.random());

                                    if (filter_article_categories.length > 0) {

                                        categoriesContentRandom += `<div class="row mb-4">
                                                                        <div class="col-12 col-md-6">
                                                                            <h3>บทความที่เกี่ยวข้อง</h3>
                                                                        </div>
                                                                    </div>`;

                                        categoriesContentRandom += `<div class="row">`;

                                        for (let i = 0; i < filter_article_categories.slice(0, 3).length; i++) {
                                            let article_category_badge = article_data.length > 0 ? article_data.filter((article_element) => article_element.id == filter_article_categories[i].id) : [];

                                            categoriesContentRandom += `
                                                <div class="col-12 col-lg-4">
                                                    <a href="/`+blogPath()+``+filter_article_categories[i].id+`" class="d-block article mb-4 mb-lg-3">
                                                        <img src=`+ filter_article_categories[i].cover_url +` class="rounded img-fluid" />
                                                    </a>
                                                    <div class="mt-2">`;
                                                        let categoryPillSortOrder = article_category_badge[0].article_categories.length > 0 ? article_category_badge[0].article_categories.sort((a, b) => a.order - b.order) : [];

                                                        if(categoryPillSortOrder.length > 0) {
                                                            for (let j = 0 ; j < categoryPillSortOrder.length ; j++) {
                                                                categoriesContentRandom += `<a href="/category/?id=`+categoryPillSortOrder[j].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ categoryPillSortOrder[j].name +`</a>`;
                                                            }
                                                        }
                                                    categoriesContentRandom += `</div>
                                                    <a href="/`+blogPath()+``+filter_article_categories[i].id+`" class="d-block article mb-4 mb-lg-3">
                                                        <div class="mt-2">`
                                                            + filter_article_categories[i].title +
                                                        `</div>
                                                    </a>
                                                </div>
                                            `;
                                        }
                                        categoriesContentRandom += "</div>";
                                    }
                                }

                                $("#article-category-related").html(categoriesContentRandom);

                            }
                        },
                        error: function(err)
                        {
                            console.log(err);
                        },
                        complete: function(data)
                        {
                            $("#loader-page-blog-related").css('display', 'none');
                        }
                    });

                },
                error: function(err)
                {
                    console.log(err);
                }
            });


        },
        error: function(err)
        {
            console.log(err);
        },
        complete: function(data)
        {
            $("#loader-page-blog-title").css('display', 'none');
        }
    });
}

if ($('.blog-lazy-load').length) {
    var param_id = $('.blog-lazy-load').attr('data-id')
    var backendUrl = $('meta[name="backend-host"]').attr('content')
    var article_url_by_id = `${backendUrl}/articles/${param_id}`;
    var related_article_category = [];
    var current_article_id = 0;

    $.ajax({
        url: article_url_by_id,
        type:'GET',
        beforeSend: function(data) {
            $("#loader-page-blog-title").css('display', 'block');
        },
        success: function(data)
        {

            let title = data.title + " | จินตนาการ สืบสาน วรรณกรรมไทยกับอินทัช ปีที่ 15 - Intouchstation";

            $('title').text(title);

            $('meta[property="og:title"]').attr('content', title);

            $('meta[property="og:image"]').attr('content', data.cover_url);

            current_article_id = data.id;

            var date = new Date(data.published_at)
            var format_date = date.toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })

            let display = `
                <div class="row">
                    <div class="col-12 col-lg-8">
                        <div class="d-block article mb-4 mb-lg-3">
                            <img src=`+data.cover_url+` class="rounded img-fluid"/>

                            <div class="mt-3" id="badge"></div>

                            <div class="mt-2 blog-article-category-title">`+data.title+`</div>

                            <small class="mt-3 text-muted">
                                <span class="article-date pr-3">
                                <i class="far fa-calendar-alt pr-1"></i>
                                    `+format_date+`
                                </span>
                            </small>
                        </div>
                        <hr class="mt-0 mb-4 mb-lg-4">
                    </div>
                </div>
            `;

            $("#results").html(display);
            $("#html-body-inner").html(data.content_html);

            let badge = "";
            let categoryPillSortOrder = data.article_categories.length > 0 ? data.article_categories.sort((a, b) => a.order - b.order) : [];

            for (let i = 0 ; i < categoryPillSortOrder.length ; i++) {
                badge += `<a href="/category/?id=`+categoryPillSortOrder[i].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ categoryPillSortOrder[i].name +`</a>`;
                related_article_category.push(categoryPillSortOrder[i])
            }
            $("#badge").html(badge);

            let article_category_url = `${backendUrl}/article-categories?_sort=order%3Aasc`;
            let article_url = `${backendUrl}/articles?_sort=published_at%3Adesc`;

            $.ajax({
                url: article_category_url,
                type:'GET',
                beforeSend: function(data) {
                    $("#loader-page-blog-related").css('display', 'block');
                },
                success: function(response)
                {

                    $.ajax({
                        url: article_url,
                        type:'GET',
                        success: function(article_data)
                        {

                            if(related_article_category.length > 0){

                                var categories = response.filter((category) => category.id == related_article_category[0].id);

                                let categoriesContentRandom = "";

                                for (let cate_index = 0; cate_index < categories.length; cate_index++ ) {

                                    var overthanCurrentDate = categories[cate_index].articles.length > 0 ? categories[cate_index].articles.filter((element) => (new Date(element.published_at) < new Date()) && (element.id != current_article_id)) : [];

                                    var filter_article_categories = overthanCurrentDate.sort(() => 0.5 - Math.random());

                                    if (filter_article_categories.length > 0) {

                                        categoriesContentRandom += `<div class="row mb-4">
                                                                        <div class="col-12 col-md-6">
                                                                            <h3>บทความที่เกี่ยวข้อง</h3>
                                                                        </div>
                                                                    </div>`;

                                        categoriesContentRandom += `<div class="row">`;

                                        for (let i = 0; i < filter_article_categories.slice(0, 3).length; i++) {
                                            let article_category_badge = article_data.length > 0 ? article_data.filter((article_element) => article_element.id == filter_article_categories[i].id) : [];

                                            categoriesContentRandom += `
                                                <div class="col-12 col-lg-4">
                                                    <a href="/`+blogPath()+``+filter_article_categories[i].id+`" class="d-block article mb-4 mb-lg-3">
                                                        <img src=`+ filter_article_categories[i].cover_url +` class="rounded img-fluid" />
                                                    </a>
                                                    <div class="mt-2">`;
                                                        let categoryPillSortOrder = article_category_badge[0].article_categories.length > 0 ? article_category_badge[0].article_categories.sort((a, b) => a.order - b.order) : [];

                                                        if(categoryPillSortOrder.length > 0) {
                                                            for (let j = 0 ; j < categoryPillSortOrder.length ; j++) {
                                                                categoriesContentRandom += `<a href="/category/?id=`+categoryPillSortOrder[j].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ categoryPillSortOrder[j].name +`</a>`;
                                                            }
                                                        }
                                                    categoriesContentRandom += `</div>
                                                    <a href="/`+blogPath()+``+filter_article_categories[i].id+`" class="d-block article mb-4 mb-lg-3">
                                                        <div class="mt-2">`
                                                            + filter_article_categories[i].title +
                                                        `</div>
                                                    </a>
                                                </div>
                                            `;
                                        }
                                        categoriesContentRandom += "</div>";
                                    }
                                }

                                $("#article-category-related").html(categoriesContentRandom);

                            }
                        },
                        error: function(err)
                        {
                            console.log(err);
                        },
                        complete: function(data)
                        {
                            $("#loader-page-blog-related").css('display', 'none');
                        }
                    });

                },
                error: function(err)
                {
                    console.log(err);
                }
            });


        },
        error: function(err)
        {
            console.log(err);
        },
        complete: function(data)
        {
            $("#loader-page-blog-title").css('display', 'none');
        }
    });
}

if ($('body.index').length) {
    let backendUrl = $('meta[name="backend-host"]').attr('content')
    let article_home_url = `${backendUrl}/articles?_sort=published_at%3Adesc`;

    $.ajax({
        url: article_home_url,
        type:'GET',
        beforeSend: function(data) {
            $("#loader-article-home-content").css('display', 'block');
        },
        success: function(res)
        {
            let articles = res.length > 0 ? res.filter((element) => new Date(element.published_at) < new Date()) : [];

            if (articles.length > 0) {

                let articleContent = "";

                let lastElement = articles.length >= 5 ? 4 : articles.length - 1;

                articleContent += `<div class="row mb-4">
                    <div class="col-12 col-md-6">
                        <h3>บทความน่าสนใจ</h3>
                    </div>
                    <div class="col-12 col-md-6 text-left text-md-right">
                        <a href="/blogs" class="d-block mt-1 text-success">ดูบทความทั้งหมด</a>
                    </div>
                </div>`;

                articleContent += `<div class="row">`;

                for (let i = 0; i < articles.slice(0, 5).length; i++) {

                    if(i < 2) {
                        articleContent += `
                            <div class="col-12 col-lg-4">
                                <a href="/`+blogPath()+``+articles[i].id+`" class="d-block article mb-4 mb-lg-3">
                                    <img src=`+ articles[i].cover_url +` class="rounded img-fluid" />
                                </a>
                                <div class="mt-2">`;
                                    let coupleDataSortOrder = articles[i].article_categories.length > 0 ? articles[i].article_categories.sort((a, b) => a.order - b.order) : [];

                                    if(coupleDataSortOrder.length > 0) {
                                        for (let j = 0 ; j < coupleDataSortOrder.length ; j++) {
                                            articleContent += `<a href="/category/?id=`+coupleDataSortOrder[j].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ coupleDataSortOrder[j].name +`</a>`;
                                        }
                                    }
                                articleContent += `</div>
                                <a href="/`+blogPath()+``+articles[i].id+`" class="d-block article mb-4 mb-lg-3">
                                    <div class="mt-2">`
                                        + articles[i].title +
                                    `</div>
                                </a>
                            </div>
                        `;
                    }

                    if(i >= 2 && i <=4){
                        if(i == 2){
                            articleContent += `<div class="col-12 col-lg-4">`;
                        }
                        articleContent += `
                                <div class="row">
                                    <div class="col-4 col-md-3 col-lg-5 col-xl-4">
                                        <a href="/`+blogPath()+``+articles[i].id+`" class="d-block article mb-4 mb-lg-2">
                                            <div class="article-square-thumbnail" style="background-image: url(`+ articles[i].cover_url +`)"></div>
                                        </a>
                                    </div>

                                    <div class="col-8 col-md-9 col-lg-7 col-xl-8 pl-0">
                                        <div class="mt-4 mb-3 d-none d-sm-block d-lg-none"></div>`;
                                            let dataSortOrder = articles[i].article_categories.length > 0 ? articles[i].article_categories.sort((a, b) => a.order - b.order) : [];

                                            if(dataSortOrder.length > 0) {
                                                for (let j = 0 ; j < dataSortOrder.length ; j++) {
                                                    articleContent += `<a href="/category/?id=`+dataSortOrder[j].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ dataSortOrder[j].name +`</a>`;
                                                }
                                            }
                                        articleContent += `
                                        <a href="/`+blogPath()+``+articles[i].id+`" class="d-block article mb-4 mb-lg-2">
                                            <div class="article-compact-title">`
                                                + articles[i].title +
                                            `</div>
                                        </a>
                                    </div>
                                </div>
                            <hr class="mt-0 mb-4 mb-lg-2">
                        `;
                        if(i == lastElement ){
                            articleContent += `</div>`;
                        }
                    }
                }
                articleContent += "</div>";

                $("#article-home-content").html(articleContent);

            }
        },
        error: function(err)
        {
            console.log(err);
        },
        complete: function(data)
        {
            $("#loader-article-home-content").css('display', 'none');
        },
    });
}
