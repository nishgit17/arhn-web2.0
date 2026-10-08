/* Use the Drive artwork as the spine card texture instead of MP4 posters. */
(function installCardMediaSource() {
    const nativeFetch = window.fetch.bind(window);
    const projectsUrl = 'assets/data/projects.json';
    const driveUrl = 'assets/data/aarohandata.json';
    window.fetch = function cardMediaFetch(input, init) {
        const url = typeof input === 'string' ? input : input && input.url;
        if (!url) return nativeFetch(input, init);

        if (url.includes('uil.') && url.includes('.json')) {
            return nativeFetch(input, init).then(response => response.json()).then(uil => {
                if (window.innerWidth < 768) {
                    try {
                        uil['MESH_Element_20_home_scenescale'] = [0.6, 0.6, 1];

                        // CleanRoom scaling for mobile (Splash screen)
                        uil['MESH_Element_22_CleanRoomscale'] = [1.8, 0.9, 1]; // Logo Cross
                        uil['MESH_Element_15_CleanRoomscale'] = [1.3, 1.1, 1]; // AAROHAN Text
                        uil['MESH_Element_20_CleanRoomscale'] = [1.1, 0.9, 1]; // OVERRIDE Text Mesh

                        if (uil['INPUT_Element_20_CleanRoom_text3d_data']) {
                            let textData = JSON.parse(uil['INPUT_Element_20_CleanRoom_text3d_data']);
                            textData.size = 0.035;
                            textData.width = 0.8;
                            uil['INPUT_Element_20_CleanRoom_text3d_data'] = JSON.stringify(textData);
                        }

                        // WorkDetailContent scaling for mobile (Event detail card and text)
                        uil['MESH_Element_6_WorkDetailContentscale'] = [3.8, 2.28, 2]; // Card poster

                        if (uil['INPUT_Element_5_WorkDetailContent_text3d_data']) {
                            let t5 = JSON.parse(uil['INPUT_Element_5_WorkDetailContent_text3d_data']);
                            t5.size = 0.28; // was 0.4
                            t5.width = 2.1; // was 2.5
                            uil['INPUT_Element_5_WorkDetailContent_text3d_data'] = JSON.stringify(t5);
                        }

                        if (uil['INPUT_Element_8_WorkDetailContent_text3d_data']) {
                            let t8 = JSON.parse(uil['INPUT_Element_8_WorkDetailContent_text3d_data']);
                            t8.size = 0.055; // was 0.07
                            t8.width = 2.2;  // was 2.8
                            uil['INPUT_Element_8_WorkDetailContent_text3d_data'] = JSON.stringify(t8);
                        }
                    } catch (e) { }
                }
                return new Response(JSON.stringify(uil), { status: 200, headers: { 'Content-Type': 'application/json' } });
            });
        }

        if (!url.endsWith(projectsUrl) && !url.endsWith(driveUrl)) return nativeFetch(input, init);
        return nativeFetch(`${driveUrl}?t=${Date.now()}`, init).then(response => response.json()).then(driveCards => {
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
                // Use the small WebP derivatives for WebGL startup. The source
                // posters remain available for detail views/downloads, but
                // loading all full-resolution PNG/JPEG files blocks the scene
                // around the 75% asset-loader mark on a cold visit.
                const localExtension = 'webp';
                // Same-origin files avoid Drive redirects/CORS entirely and
                // are safe for texImage2D once ImageDecoder has completed.
                const is2026 = String(card.date).includes('2026') || String(card.completionDate).includes('2026');
                const imageName = is2026 ? card.id : `card-${localIndex}`;
                const imageURL = driveId
                    ? `assets/images/aarohan-cards/optimized/${imageName}.${localExtension}`
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
