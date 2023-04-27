install:
	cp -r ./kwin4_effect_geometry_change ~/.local/share/kwin/effects/

package:
	tar -czf ./kwin4_effect_geometry_change.tar.gz ./kwin4_effect_geometry_change
