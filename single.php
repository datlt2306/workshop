<?php get_header(); ?> <!-- Gọi tệp header.php -->


<div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(images/ocean.jpg)"></div>
    <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php the_title(); ?></h1>
        <div class="page-banner__intro">
            <p>Learn how the school of your dreams got started.</p>
        </div>
    </div>
</div>

<div class="container container--narrow page-section">
    <div class="generic-content">
        <?php
        if (have_posts()) {
            while (have_posts()) {
                the_post();
        ?>
                <article>
                    <?php the_content(); ?>
                </article>
        <?php
            }
        } ?>
    </div>
</div>

<?php get_footer(); ?> <!-- Gọi tệp footer.php -->