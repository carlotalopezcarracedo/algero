sed -i 's|https://www.youtube-nocookie.com/embed/sxfv_8KGguI?autoplay=1\&mute=\${isMuted ? '\''1'\'' : '\''0'\''}\&loop=1\&playlist=sxfv_8KGguI\&controls=0\&showinfo=0\&rel=0\&iv_load_policy=3\&disablekb=1\&modestbranding=1\&playsinline=1\&enablejsapi=1|https://www.villabarbarina.com/images_offerta/villa-barbarina-comp.mp4|g' src/pages/HomePage.tsx
sed -i 's|<iframe|<video|g' src/pages/HomePage.tsx
sed -i 's|</iframe>|</video>|g' src/pages/HomePage.tsx
sed -i 's|allow="accelerometer.*"||g' src/pages/HomePage.tsx
