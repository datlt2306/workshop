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
    <!-- <div class="metabox metabox--position-up metabox--with-home-link">
        <p>
            <a class="metabox__blog-home-link" href="#"><i class="fa fa-home" aria-hidden="true"></i> Back to About Us</a> <span class="metabox__main">Our History</span>
        </p>
    </div>

    <div class="page-links">
        <h2 class="page-links__title"><a href="#">About Us</a></h2>
        <ul class="min-list">
            <li class="current_page_item"><a href="#">Our History</a></li>
            <li><a href="#">Our Goals</a></li>
        </ul>
    </div> -->

    <div class="generic-content">
        <ul>
            <?php
            if (have_posts()) {
                while (have_posts()) {
                    the_post();
            ?>
                    <li>
                        <h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
                        <?php the_content(); ?>
                    </li>
            <?php
                }
            } ?>
        </ul>
    </div>
</div>

<?php get_footer(); ?> <!-- Gọi tệp footer.php -->