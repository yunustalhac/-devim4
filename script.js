const liste = document.querySelector(".liste");
const commentsContainer = document.querySelector(".comments-container");
const postError = document.querySelector(".hata");


// Posts API'sine istek gönderme
fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Posts API'sine erişilemiyor: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(posts => {
        posts.forEach(item => {
            const elemanButon = document.createElement("button");
            elemanButon.textContent = `${item.id}) ${item.body}`;
            elemanButon.classList.add("border-2", "border-black", "rounded", "font-bold", "p-2");
            liste.append(elemanButon);

            elemanButon.addEventListener("click", () => {
                location.href = `comments.html?postId=${item.id}`;
            });
        });
    })
    .catch(error => {
        // Posts API'sine erişim hatası
        console.error(`Posts API'sine erişim hatası: ${error}`);
        const errorMessage = document.createElement("h1");
        errorMessage.textContent = `Posts API'sine erişilemiyor. Lütfen sayfayı yenileyin.`;
        errorMessage.style.background = "rgba(255, 0, 0, 0.5)"; // Kırmızı renk, %50 şeffaflık
        errorMessage.style.padding = "15px";
        errorMessage.style.margin = "5px";
        postError.append(errorMessage);
    });

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    let postId = urlParams.get('postId');

    // Geçersiz veya belirtilmemiş post ID kontrolü
    if (!postId || isNaN(postId)) {
        
        console.error("Geçersiz veya belirtilmemiş post ID.");
        const errorContainer = document.createElement("p");
        errorContainer.textContent = "Geçersiz gönderi ID. Lütfen geçerli bir gönderi seçin.";
        errorContainer.classList.add("text-red-500", "font-bold");
        commentsContainer.appendChild(errorContainer);
        alert("HATA: liste dışında bir post seçemezsiniz")

        // Önceki sayfaya yönlendirme
        const previousPageUrl = "http://localhost:63342/patikajs/%C3%B6dev4/post.html";
        window.location.href = previousPageUrl;
        return;
    }

    // Comments API'sine istek gönderme
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Comments API'sine erişilemiyor: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(comments => {
            // Comments API'sinden başarılı dönüş
            if (comments.length === 0) {
                const previousPageUrl = "http://localhost:63342/patikajs/%C3%B6dev4/post.html";
                window.location.href = previousPageUrl;

                alert("HATA: liste dışında bir post seçemezsiniz")
            }

            // Post başlık ve içeriğini getirme
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Post API'sine erişilemiyor: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(post => {
                    const postTitle = document.createElement("h1");
                    postTitle.textContent = post.title;
                    postTitle.classList.add("text-2xl", "mb-5", "font-bold", "bg-gray-100", "p-2", "rounded-2xl");

                    const postBody = document.createElement("h3");
                    postBody.textContent = post.body;
                    postBody.classList.add("text-xl", "mb-5", "font-bold", "bg-gray-200", "p-2", "rounded-2xl");

                    commentsContainer.prepend(postBody);
                    commentsContainer.prepend(postTitle);
                })
                .catch(error => {
                    console.error(`Post API'sine erişim hatası: ${error}`);
                    throw new Error("Gönderi başlığı ve içeriği alınamadı.");
                });

            // Yorumları ekrana yazdırma
            comments.forEach(item => {
                const commentTitle = document.createElement("h3");
                commentTitle.textContent = item.name;
                commentTitle.classList.add("font-bold");

                const commentBody = document.createElement("p");
                commentBody.textContent = item.body;
                commentBody.classList.add("mb-5");

                commentsContainer.append(commentTitle);
                commentsContainer.append(commentBody);
            });
        })
        .catch(error => {
            // Comments API'sine erişim hatası veya yorum bulunamadı hatası
            console.error(`Comments API'sine erişim hatası: ${error}`);
            const errorMessage = document.createElement("h1");
            errorMessage.textContent = error.message;
            errorMessage.style.background = "rgba(255, 0, 0, 0.5)";
            errorMessage.style.padding = "15px";
            errorMessage.style.margin = "5px";
            commentsContainer.append(errorMessage);
        });
});

function geriDon() {
    location.href = "http://localhost:63342/patikajs/%C3%B6dev4/post.html?_ijt=j5ji0kt239tvgkf78jqqu2a8as&_ij_reload=RELOAD_ON_SAVE";
}
