<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dataset_feature_properties', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dataset_feature_id')->default(0);
            $table->unsignedBigInteger('property_id')->default(0);
            $table->string('value')->nullable();
            $table->string('xlink_href_type')->nullable();
            $table->string('xlink_href')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();

            $table->index('xlink_href_type');
            $table->index('xlink_href');

            // add FK
            $table->foreign('dataset_feature_id')->references('id')->on('dataset_features')->onDelete('cascade');

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dataset_feature_properties');
    }
};
