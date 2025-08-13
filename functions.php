<?php

function xuong_wp_files() {
    wp_enqueue_style('main-style', get_stylesheet_uri()); // mặc định gọi ra file style.css
    wp_enqueue_style('index-css', get_template_directory_uri() . '/build/index.css');
    wp_enqueue_style('style-index', get_template_directory_uri() . '/build/style-index.css'); // mặc định gọi ra file style.css
    wp_enqueue_script('index-js', get_template_directory_uri() . '/build/index.js', array('jquery'), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'xuong_wp_files');
