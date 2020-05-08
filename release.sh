#!/bin/sh

set -e

usage() {
	printf 'Usage: %s (major|minor|patch) \n' "$0"
	exit 1
}

if [ $# -ne 1 ]; then
	usage
fi

set -eu

desc=$(git describe --dirty --abbrev=0)

case $desc in
	*dirty*) printf 'Dirty working tree, commit your changes first!\n' >&2; exit 1;;
esac
desc="${desc#v}"

IFS=. read -r major minor patch <<EOF
$(printf '%s\n' "$desc")
EOF

prev=$major.$minor.$patch
case $1 in
	major) major=$((major+1));;
	minor) minor=$((minor+1));;
	patch) patch=$((patch+1));;
	*) usage;;
esac
version=$major.$minor.$patch

sed -i "s/\"version\": \"$prev\"/\"version\": \"$version\"/" manifest.json

git commit -m "Release v$version" manifest.json

git tag -a v$version -m "mute-tab $version"

make -B

git push
