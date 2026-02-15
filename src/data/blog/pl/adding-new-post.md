---
author: Sat Naing
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: Dodawanie nowych wpisów w motywie AstroPaper
slug: dodawanie-nowych-wpisow
featured: true
draft: false
tags:
  - docs
description: Zasady i rekomendacje dotyczące tworzenia lub dodawania nowych wpisów w motywie AstroPaper.
---

Poniżej znajdują się zasady, rekomendacje oraz wskazówki dotyczące tworzenia nowych wpisów w motywie blogowym AstroPaper.

<figure>
  <img
    src="https://images.pexels.com/photos/159618/still-life-school-retro-ink-159618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    alt="Klasyczne drewniane biurko z materiałami do pisania, zegarem vintage i skórzaną torbą. Zdjęcie stockowe"
  />
  <figcaption class="text-center">
    Zdjęcie: <a href="https://www.pexels.com/photo/brown-wooden-desk-159618/">Pixabay</a>
  </figcaption>
</figure>

## Spis treści

## Tworzenie wpisu na blogu

Aby napisać nowy wpis na blogu, utwórz plik markdown w katalogu `src/data/blog/`.

> Przed wersją AstroPaper v5.1.0 wszystkie wpisy musiały znajdować się w `src/data/blog/`, co oznaczało brak możliwości organizowania ich w podkatalogach.

Od wersji AstroPaper v5.1.0 można organizować wpisy w podkatalogach, co ułatwia zarządzanie treścią.

Na przykład, jeśli chcesz pogrupować wpisy w folderze `2025`, możesz umieścić je w `src/data/blog/2025/`. Wpływa to również na adres URL wpisu, więc `src/data/blog/2025/example-post.md` będzie dostępny pod adresem `/posts/2025/example-post`.

Jeśli nie chcesz, aby podkatalog wpływał na adres URL wpisu, dodaj na początku nazwy folderu podkreślenie `_`.

> Wskazówka: możesz również nadpisać slug wpisu w frontmatter. Szczegóły w kolejnej sekcji.

Jeśli adres URL podkatalogu nie pojawia się w buildzie, usuń `node_modules`, zainstaluj pakiety ponownie i przebuduj projekt.

## Frontmatter

Frontmatter to główne miejsce przechowywania ważnych informacji o wpisie (artykule). Znajduje się na początku artykułu i zapisany jest w formacie YAML. Więcej informacji o frontmatter znajdziesz w [dokumentacji Astro](https://docs.astro.build/en/guides/markdown-content/).

Poniżej lista właściwości frontmatter dla wpisów.

| Właściwość       | Opis                                                                   | Uwagi                   |
| ---------------- | ---------------------------------------------------------------------- | ----------------------- |
| **title**        | Tytuł wpisu (h1)                                                       | wymagane                |
| **description**  | Opis wpisu. Używany w zajawce oraz opisie strony wpisu                 | wymagane                |
| **pubDatetime**  | Data publikacji w formacie ISO 8601                                    | wymagane                |
| **modDatetime**  | Data modyfikacji w formacie ISO 8601 (dodawaj tylko przy edycji wpisu) | opcjonalne              |
| **author**       | Autor wpisu                                                            | domyślnie = SITE.author |
| **slug**         | Slug wpisu                                                             | domyślnie = nazwa pliku |
| **featured**     | Czy wpis ma być wyróżniony na stronie głównej                          | false                   |
| **draft**        | Oznacza wpis jako nieopublikowany                                      | false                   |
| **tags**         | Słowa kluczowe powiązane z wpisem                                      | others                  |
| **ogImage**      | Obraz OG wpisu (social media, SEO)                                     | domyślny                |
| **canonicalURL** | Kanoniczny adres URL artykułu                                          | opcjonalne              |
| **hideEditPost** | Ukrywa przycisk edycji wpisu                                           | false                   |
| **timezone**     | Strefa czasowa wpisu                                                   | SITE.timezone           |

> Wskazówka: datę ISO 8601 uzyskasz przez `new Date().toISOString()` w konsoli.

Wymagane są tylko pola: `title`, `description`, `pubDatetime`.

Tytuł i opis są ważne dla SEO, dlatego zaleca się ich dodawanie.

`slug` jest unikalnym identyfikatorem URL i musi być unikalny. Spacje należy zastąpić `-` lub `_` (zalecany `-`). Domyślnie slug generowany jest z nazwy pliku, ale można go nadpisać w frontmatter.

Jeśli nie podasz `tags`, użyty zostanie domyślny tag `others`. Możesz to zmienić w pliku `/src/content/config.ts`.

```ts
// src/content/config.ts
export const blogSchema = z.object({
  draft: z.boolean().optional(),
  tags: z.array(z.string()).default(["others"]),
});
```
