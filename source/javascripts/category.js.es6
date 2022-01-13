if ($('body.category_index').length) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var param_id = url.searchParams.get("id");
    var backendUrl = $('meta[name="backend-host"]').attr('content')

    var article_category_url_by_id = `${backendUrl}/article-categories/${param_id}`;
    var article_url = `${backendUrl}/articles?_sort=published_at%3Adesc`;

    $.ajax({
        url: article_category_url_by_id,
        type:'GET',
        beforeSend: function(data) {
            $("#loader-page-category-content").css('display', 'block');
        },
        success: function(category_data)
        {
            let title = category_data.name + " | จินตนาการ สืบสาน วรรณกรรมไทยกับอินทัช ปีที่ 15 - Intouchstation";

            $('title').text(title);

            $('meta[property="og:title"]').attr('content', title);

            $.ajax({
                url: article_url,
                type:'GET',
                success: function(article_data)
                {

                    let content = "";

                    content = ` <h1 class="mb-3">`+ category_data.name +`</h1>
                                <div class="row">
                                    <div id="category-body"></div>
                                </div>`;

                    $("#category-content").html(content);

                    let article_content = "";

                    var onTime = category_data.articles.length > 0 ? category_data.articles.filter((element) => {if (new Date(element.published_at) < new Date()) return category_data }) : [];

                    var filter_article_categories = onTime.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

                    for(let i = 0; i < filter_article_categories.length; i++) {

                        let article_category_badge = article_data.length > 0 ? article_data.filter((article_element) => article_element.id == filter_article_categories[i].id) : [];

                        var date = new Date(filter_article_categories[i].published_at)
                        var format_date = date.toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })

                        article_content += `
                            <div class="col-12 col-lg-10 col-xl-8 mb-5">
                                <a href="/blog/?id=`+filter_article_categories[i].id+`" class="article">
                                    <img src=`+ filter_article_categories[i].cover_url +` class="rounded img-fluid"/>
                                </a>
                                <div class="mt-3">`;
                                    let categoryPillSortOrder = article_category_badge[0].article_categories.length > 0 ? article_category_badge[0].article_categories.sort((a, b) => a.order - b.order) : [];

                                    if(categoryPillSortOrder.length > 0) {
                                        for (let j = 0 ; j < categoryPillSortOrder.length ; j++) {
                                            article_content += `<a href="/category/?id=`+categoryPillSortOrder[j].id+`" class="badge badge-pill badge-light link-badge-category mr-2">`+ categoryPillSortOrder[j].name +`</a>`;
                                        }
                                    }
                                article_content += `</div>
                                
                                <a href="/blog/?id=`+filter_article_categories[i].id+`" class="article">
                                    <h4 class="mt-2">`+ filter_article_categories[i].title+`</h4>

                                    <small class="mt-3 text-muted">
                                        <span class="article-date pr-3">
                                        <i class="far fa-calendar-alt pr-1"></i>
                                            `+format_date+`
                                        </span>
                                    </small>

                                    <p class="mt-3">`+ filter_article_categories[i].excerpt +`</p>
                                </a>    
                            </div>`;

                        }
                    $("#category-body").html(article_content);
                },
                error: function(err)
                {
                    console.log(err);
                },
                complete: function(data)
                {
                    $("#loader-page-category-content").css('display', 'none');
                },
            });
        },
        error: function(err)
        {
            console.log(err);
        }
    });
}
