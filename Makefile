SIZES := 16 19 38 48 128
ICONNAMES := $(addprefix audible-, $(SIZES)) $(addprefix muted-, $(SIZES)) $(addprefix webstore-icon-, $(SIZES))
ICONS := $(addprefix images/, $(addsuffix .png, $(ICONNAMES)))

FILES := $(ICONS) background.js manifest.json

.PHONY: zip
zip: out.zip

out.zip: $(FILES)
	rm -f $@
	zip -r $@ $^

# There's no sane way to avoid duplicating the recipe here.
images/audible-%.png: images/audible.svg
	inkscape -z -e $@ -w $* -h $* $<
images/muted-%.png: images/muted.svg
	inkscape -z -e $@ -w $* -h $* $<

images/webstore-icon-128.png: images/muted.svg
	convert $< -resize 90x90! -bordercolor white -border 3x3 -bordercolor none -border 16x16 $@

images/webstore-icon-%.png: images/webstore-icon-128.png
	convert $< -resize $*x$* $@
