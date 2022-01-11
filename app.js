$(document).ready(() => {
    /* Bars Aside */
    $('.bars').on('click', () => {
        if($('aside').css('display') == 'none'){
            $('aside').addClass('slideIn');
            setTimeout(() => {
                $('aside').removeClass('slideOut');
            }, 500);
        }else{
            $('aside').addClass('slideOut');
            setTimeout(() => {
                $('aside').removeClass('slideIn');
                $('aside').removeClass('slideOut');
            }, 250);
        }
    });

    /* Remove Loading */
    function loading(id = false){
        setTimeout(() => {
            if(id == false){
                $('#loading').hide();
            }else{
                $('#loading').show();
            }
        }, 1000);
    }

    /* REST API */
    const endpoint = "https://api.quran.com/api/v3";
    let header = [];

    let changeTitle = (text) => {
        $('.ct').html(text);
    }
  
    let verses = (id = 1) => {
        $.ajax({
            type: "GET",
            url: endpoint + `/chapters/${id}/verses?language=id`,
            success: function (response) {
                let template = '';

                response.verses.forEach(e => {
                    let translate = ``;
                    let latin = ``;
                    e.words.forEach(el => {
                        translate += el.translation.text + " ";
                        if(el.transliteration.text !== null){
                            latin += el.transliteration.text + " ";
                        }
                    });

                    template += `
                    <div class="item">
                        <div class="row align-items-center justify-content-between">
                            <div class="col-1">
                                <div class="number">${ e.verse_number }</div>
                            </div>
                            <div class="col-11">
                                <div class="ms-4 ayat">
                                    <h2>${ e.text_madani }</h2>
                                    <p class="latin">${ latin }</p>
                                    <p class="translate">${ translate }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                })

                $('.verses').html(template);
                loading();
            }
        });
    }

    let changeVarses = (id) => {
         /* Navigation Active */
        $('.chapter').on('click', function(){
            $('.active').removeClass('active');
            $(this).addClass('active');
        });
        
        $('.change-varses').on('click', function(){
            let id = $(this).data('id');
            let name = $(this).data('name');

            $('.verses').html(`
                <div class='d-flex aling-items-center justify-content-center my-5'>
                    <img src="./img/loading.gif" alt="Loading" width="25px">
                </div>
            `);

            verses(id);
            changeTitle(name);

            $('aside').addClass('slideOut');
            setTimeout(() => {
                $('aside').removeClass('slideIn');
                $('aside').removeClass('slideOut');
            }, 250);
        });
    }

    $.ajax({
        type: "GET",
        url: endpoint + "/chapters?language=id",
        success: function (response) {
            let template = '';
            let count = 0;
            active = '';

            response.chapters.forEach(e => {
                if(count == 0){
                    active = 'active';
                }else{
                    active = '';
                }

                template += `
                    <div class="chapter ${active}">
                        <a href="javascript:void(0)" class="change-varses" data-id="${ e.id }" data-name="${ e.name_complex }">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="name-latin d-flex align-items-center">
                                    <div class="number">
                                        ${ e.chapter_number }
                                    </div>
                                    <div class="name ms-4">
                                        <h4>${ e.name_complex }</h4>
                                        <p>${ e.translated_name.name }</p>
                                    </div>
                                </div>
                                <div class="name-arabic">
                                    ${ e.name_arabic }
                                </div>
                            </div>
                        </a>
                    </div>
                `; 
                count += 1;
            });
            $('.chapters').html(template);
            changeTitle(response.chapters[0].name_complex);
            verses(1);
            changeVarses();
        }
    });

    /* Breadcrumb Button */
    $('.credit').on('click', () => {
        Swal.fire({
            confirmButtonColor: '#338b7d',
            html: `
            <div style='text-align:left;'>
                <h4>Al-Qur'an</h4>
                <p>Aplikasi ini di buat untuk membaca Al-Qur'an dengan mudah dan lebih fleksibel dimanapun kita berada.</p>
                <h4>Version</h4>
                <p>1.0.0</p>
                <h4>Credit</h4>
                <p>Ade Rizki Wahyudi</p>
                <h4>Tanggal Terbit</h4>
                <p>Januari, 11 2022</p>
                <h4>Support</h4>
                <p>
                    <img src='https://www.seekpng.com/png/detail/380-3807393_unsri-vector-logo-logo-universitas-sriwijaya.png' width='75px' alt='unsri'/>
                    <img src='https://pbs.twimg.com/profile_images/572300601967398912/pBlA0xwX_400x400.png' width='75px' alt='unsri'/>
                </p>
            </div>
            `,
        });
    });

    $('.belum-tersedia').on('click', () => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Maaf, untuk versi saat ini fitur belum tersedia.',
        })
    })
})