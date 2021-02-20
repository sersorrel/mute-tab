SIZES := 16 19 38 48 128
ICONNAMES := $(addprefix audible-dark-, $(SIZES)) $(addprefix audible-light-, $(SIZES)) $(addprefix muted-dark-, $(SIZES)) $(addprefix muted-light-, $(SIZES)) $(addprefix webstore-icon-, $(SIZES))
ICONS := $(addprefix images/, $(addsuffix .png, $(ICONNAMES)))

FILES := $(ICONS) $(shell git ls-files ':!:.gitignore' ':!:Makefile' ':!:images/' ':!:release.sh')

.PHONY: zip
zip: out.zip

out.zip: $(FILES)
	rm -f $@
	zip -r $@ $^

# There's no good way to avoid duplicating the recipe here.
images/audible-dark-%.png: images/audible.svg
	inkscape -z -o $@ -w $* -h $* $<
images/muted-dark-%.png: images/muted.svg
	inkscape -z -o $@ -w $* -h $* $<

images/audible-light-%.png: images/audible-dark-%.png
	convert $< -negate $@
images/muted-light-%.png: images/muted-dark-%.png
	convert $< -negate $@

images/webstore-icon-128.png: images/muted.svg
	convert $< -resize 90x90! -bordercolor white -border 3x3 -bordercolor none -border 16x16 $@

images/webstore-icon-%.png: images/webstore-icon-128.png
	convert $< -resize $*x$* $@
