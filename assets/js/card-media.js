/* Use the Drive artwork as the spine card texture instead of MP4 posters. */
(function installCardMediaSource() {
    const nativeFetch = window.fetch.bind(window);
    const projectsUrl = 'assets/data/projects.json';
    const driveUrl = 'assets/data/aarohandata.json';
    window.fetch = function cardMediaFetch(input, init) {
        const url = typeof input === 'string' ? input : input && input.url;
        if (!url || (!url.endsWith(projectsUrl) && !url.endsWith(driveUrl))) return nativeFetch(input, init);
        return nativeFetch(driveUrl, init).then(response => response.json()).then(driveCards => {
            // Aarohan is the sole source of card content. The engine expects a
            // CMS-shaped video object, so provide an image-backed compatibility
            // object without reintroducing any projects.json fields.
            const localImageIndex = new Map(driveCards.map((card, index) => [card.id, index]));
            const timelineValue = card => {
                const [day, month, year] = String(card.date || '').split('/').map(Number);
                const [hours = 0, minutes = 0, seconds = 0] = String(card.time || '').split(':').map(Number);
                return day && month && year
                    ? new Date(year, month - 1, day, hours || 0, minutes || 0, seconds || 0).getTime()
                    : Number.MAX_SAFE_INTEGER;
            };
            const transformed = driveCards.sort((a, b) => {
                return timelineValue(a) - timelineValue(b);
            }).map((card, index) => {
                const driveId = card.imageURL ? new URL(card.imageURL).searchParams.get('id') : null;
                // lh3 serves the file directly and sends permissive CORS headers;
                // Drive's thumbnail redirect often taints WebGL image textures.
                const localIndex = localImageIndex.get(card.id);
                const localExtension = [2, 8, 10, 21].includes(localIndex) ? 'png' : 'jpg';
                // Same-origin files avoid Drive redirects/CORS entirely and
                // are safe for texImage2D once ImageDecoder has completed.
                const imageURL = driveId
                    ? `assets/images/aarohan-cards/card-${localIndex}.${localExtension}`
                    : 'assets/images/ar-logo.png';
                const category = String(card.type || 'event').toLowerCase();
                const timeline = timelineValue(card);
                const meta = [
                    `Date : ${card.date || '-'}`,
                    `Time : ${card.time || '-'}`,
                    `Venue : ${card.venue || '-'}`
                ].join('\n');
                return {
                ...card,
                index,
                priority: timeline,
                tags: category.toUpperCase(),
                imageURL,
                // The spine label uses subhead; keep the full description in
                // body for the detail view and show the timeline metadata here.
                subhead: meta,
                cardMeta: meta,
                body: card.description,
                video: {
                    thumbnail: imageURL,
                    url: imageURL,
                    mimeType: 'image/jpeg'
                }
                };
            });
            // Keep the browser-side image alive while WebGL initializes. This
            // also retries transient Drive/CDN failures before the first draw.
            transformed.forEach(card => {
                if (!card.imageURL.startsWith('http')) return;
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.decoding = 'async';
                image.src = card.imageURL;
                Object.defineProperty(card, 'imageElement', { value: image, enumerable: false });
            });
            return new Response(JSON.stringify(transformed), { status: 200, headers: { 'Content-Type': 'application/json' } });
        });
    };
})();
