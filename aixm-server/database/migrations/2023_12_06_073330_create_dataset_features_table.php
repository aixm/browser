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
        Schema::create('dataset_features', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dataset_id')->default(0);
            $table->unsignedBigInteger('feature_id')->default(0);
            $table->unsignedBigInteger('parent_id')->default(0);
            $table->string('gml_id_value')->nullable();
            $table->string('gml_identifier_value')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();

            $table->index('gml_id_value');
            $table->index('gml_identifier_value');

            // add FK
            $table->foreign('dataset_id')->references('id')->on('datasets')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dataset_features');
    }
};
